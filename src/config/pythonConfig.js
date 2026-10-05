const fs = require("fs");
const path = require("path");


function getPythonConfig(project) {

    if (!project) {
        return null;
    }


    const fastAPI =
        project.technologies?.pythonFrameworks
            ?.some(
                technology =>
                    technology.name === "FastAPI"
            );


    if (fastAPI) {

        const entryPoint =
            detectFastAPIEntryPoint(
                project.path
            );


        const uvicornTarget =
            entryPoint || "main:app";


        return {

            runtime: "python",

            framework: "fastapi",

            dockerStrategy: "fastapi",

            packageManager:
                detectPythonPackageManager(
                    project
                ),

            development: {

                command:
                    `uvicorn ${uvicornTarget} --host 0.0.0.0 --reload`,

                port: 8000

            },

            production: {

                command:
                    `uvicorn ${uvicornTarget} --host 0.0.0.0 --port 8000`,

                buildCommand: null,

                server: "uvicorn",

                port: 8000

            }

        };

    }


    return {

        runtime: "python",

        framework: null,

        dockerStrategy: null,

        packageManager:
            detectPythonPackageManager(
                project
            ),

        development: {

            command: null,

            port: null

        },

        production: {

            command: null,

            buildCommand: null,

            server: null,

            port: null

        }

    };

}


function detectFastAPIEntryPoint(
    projectPath
) {

    const candidates = [

        "main.py",

        "app.py",

        "server.py",

        "src/main.py",

        "src/app.py",

        "src/server.py"

    ];


    for (const relativePath of candidates) {

        const filePath =
            path.join(
                projectPath,
                relativePath
            );


        if (!fs.existsSync(filePath)) {
            continue;
        }


        const content =
            fs.readFileSync(
                filePath,
                "utf8"
            );


        if (
            content.includes("FastAPI(")
        ) {

            const modulePath =
                relativePath
                    .replace(
                        /\.py$/,
                        ""
                    )
                    .replace(
                        /\\/g,
                        "."
                    )
                    .replace(
                        /\//g,
                        "."
                    );


            return `${modulePath}:app`;

        }

    }


    return null;

}


function detectPythonPackageManager(
    project
) {

    if (
        fs.existsSync(
            path.join(
                project.path,
                "poetry.lock"
            )
        )
    ) {

        return "poetry";

    }


    if (
        fs.existsSync(
            path.join(
                project.path,
                "Pipfile.lock"
            )
        )
    ) {

        return "pipenv";

    }


    return "pip";

}


module.exports = getPythonConfig;