const fs = require("fs");
const path = require("path");
const readline = require("readline");


const CLEANABLE_FILES = new Set([
    "Dockerfile",
    "Dockerfile.dev",
    "Dockerfile.prod",
    "docker-compose.yml",
    "docker-compose.yaml",
    ".dockerignore",
    ".env.example"
]);


const PROTECTED_DIRECTORIES = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".cache",
    ".vscode",
    ".idea",
    "src",
    "templates",
    "bin"
]);


function clean(options = {}) {

    const projectRoot =
        process.cwd();


    console.log(
        "🧹 dockerez Docker cleanup..."
    );


    console.log(
        "\nScanning:"
    );

    console.log(
        projectRoot
    );


    const files =
        findDockerFiles(
            projectRoot,
            projectRoot
        );


    if (
        files.length === 0
    ) {

        console.log(
            "\n✓ No generated Docker configuration files found."
        );

        return;

    }


    console.log(
        "\nDocker-related files found:"
    );


    files.forEach(
        file => {

            console.log(
                `  ✓ ${path.relative(projectRoot, file)}`
            );

        }
    );


    if (
        options.force
    ) {

        removeFiles(
            files
        );

        return;

    }


    const rl =
        readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });


    rl.question(
        `\nRemove ${files.length} Docker-related file(s)? (y/N): `,
        answer => {

            rl.close();


            if (
                answer.trim().toLowerCase() !== "y"
            ) {

                console.log(
                    "\n✓ Nothing was removed."
                );

                return;

            }


            removeFiles(
                files
            );

        }
    );

}


function findDockerFiles(
    directory,
    projectRoot
) {

    const results = [];


    let items;


    try {

        items =
            fs.readdirSync(
                directory,
                {
                    withFileTypes: true
                }
            );

    }

    catch (error) {

        return results;

    }


    for (
        const item of items
    ) {

        const fullPath =
            path.join(
                directory,
                item.name
            );


        /*
         * Files
         */

        if (
            item.isFile()
        ) {

            if (
                CLEANABLE_FILES.has(
                    item.name
                )
            ) {

                results.push(
                    fullPath
                );

            }

            continue;

        }


        /*
         * Directories
         */

        if (
            !item.isDirectory()
        ) {

            continue;

        }


        /*
         * Never scan protected
         * dockerez/source directories.
         */

        if (
            PROTECTED_DIRECTORIES.has(
                item.name
            )
        ) {

            continue;

        }


        /*
         * Never scan hidden directories.
         */

        if (
            item.name.startsWith(".")
        ) {

            continue;

        }


        /*
         * Never leave the project root.
         */

        const relativePath =
            path.relative(
                projectRoot,
                fullPath
            );


        if (
            relativePath.startsWith("..")
        ) {

            continue;

        }


        results.push(
            ...findDockerFiles(
                fullPath,
                projectRoot
            )
        );

    }


    return results;

}


function removeFiles(
    files
) {

    console.log(
        "\nRemoving Docker configuration..."
    );


    let removed = 0;


    files.forEach(
        filePath => {

            try {

                fs.unlinkSync(
                    filePath
                );


                console.log(
                    `✓ Removed ${path.relative(process.cwd(), filePath)}`
                );


                removed++;

            }

            catch (error) {

                console.log(
                    `❌ Failed to remove ${filePath}`
                );

                console.log(
                    `   ${error.message}`
                );

            }

        }
    );


    console.log(
        `\n✅ Docker configuration removed.`
    );

    console.log(
        `   Removed ${removed} file(s).`
    );

}


module.exports =
    clean;