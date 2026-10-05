const scanProjects = require("../core/projectScanner");
const analyzeProjects = require("../core/analyzer");

const generateDockerfile =
    require("../generators/dockerfile");

const generateDockerignore =
    require("../generators/dockerignore");

const generateCompose =
    require("../generators/compose");

const generateEnvExample =
    require("../generators/env");


function generate(options = {}) {

    console.log(
        "🐳 dockerez generating Docker configuration..."
    );


    const projectRoot =
        process.cwd();


    console.log("\nScanning:");
    console.log(projectRoot);


    /*
     * Scan
     */

    const projects =
        scanProjects(projectRoot);


    /*
     * Analyze
     */

    const analyzedProjects =
        analyzeProjects(projects);


    if (
        analyzedProjects.length === 0
    ) {

        console.log(
            "\n⚠️ No supported projects detected."
        );

        return;

    }


    console.log(
        `\nFound ${analyzedProjects.length} project(s).`
    );


    /*
     * Port checking
     *
     * Keep your existing port-checking
     * logic here if you already have it.
     */


    /*
     * Dockerfiles
     */

    console.log(
        "\nGenerating Dockerfiles..."
    );


    analyzedProjects.forEach(
        project => {

            generateDockerfile(
                project,
                {
                    force: options.force
                }
            );

        }
    );


    /*
     * .dockerignore
     */

    console.log(
        "\nGenerating .dockerignore files..."
    );


    analyzedProjects.forEach(
        project => {

            generateDockerignore(
                project,
                {
                    force: options.force
                }
            );

        }
    );


    /*
     * NO COMPOSE MODE
     *
     * Stop here if:
     *
     * dockerez generate --no-compose
     */

    if (
        options.compose === false
    ) {

        console.log(
            "\nℹ️ Compose generation disabled (--no-compose)."
        );

        console.log(
            "\n✅ Dockerfiles generated successfully!"
        );

        return;

    }


    /*
     * Docker Compose
     */

    console.log(
        "\nGenerating docker-compose.yml..."
    );


    generateCompose(
        projectRoot,
        analyzedProjects,
        {
            force: options.force
        }
    );


    /*
     * .env.example
     */

    console.log(
        "\nGenerating .env.example..."
    );


    generateEnvExample(
        projectRoot,
        analyzedProjects,
        {
            force: options.force
        }
    );


    console.log(
        "\n✅ Docker configuration generated successfully!"
    );

}


module.exports =
    generate;