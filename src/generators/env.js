const fs = require("fs");
const path = require("path");
const {
    writeGeneratedFile
} = require("../core/fileWriter");

function generateEnvExample(
    projectRoot,
    analyzedProjects,
    options = {}
) {
    try {   
    if (!projectRoot) {
        return;
    }


    const databases = new Set();


    analyzedProjects.forEach(
        project => {

            if (!project.config) {
                return;
            }


            const projectDatabases =
                project.config.databases || [];


            projectDatabases.forEach(
                database => {

                    databases.add(
                        database
                    );

                }
            );

        }
    );


    let output = "";


    if (
        databases.has(
            "postgresql"
        )
    ) {

        output +=
            "POSTGRES_USER=postgres\n";

        output +=
            "POSTGRES_PASSWORD=change_me\n";

        output +=
            "POSTGRES_DB=app\n";

    }


    if (output === "") {
        return;
    }


    const envPath =
        path.join(
            projectRoot,
            ".env.example"
        );


const written =
    writeGeneratedFile(
        envPath,
        output,
        options
    );

if (!written) {
    return;
}

console.log(
    `✓ .env.example generated: ${envPath}`
);
    }
    catch (error) {

        console.log(
            "❌ Failed to generate .env.example"
        );
        console.log(
            `   ${error.message}`
        );
    }       
}


module.exports =
    generateEnvExample;