const fs = require("fs");
const path = require("path");

const {
    writeGeneratedFile
} = require("../core/fileWriter");


function generateDockerignore(
    project,
    options = {}
) {

    try {

        if (!project) {

            console.log(
                "⚠️ Cannot generate .dockerignore: missing project."
            );

            return;
        }


        const templatePath =
            path.join(
                __dirname,
                "../../templates/common/dockerignore"
            );


        if (!fs.existsSync(templatePath)) {

            console.log(
                "⚠️ Common .dockerignore template not found."
            );

            return;
        }


        const dockerignorePath =
            path.join(
                project.path,
                ".dockerignore"
            );


        const template =
            fs.readFileSync(
                templatePath,
                "utf8"
            );


        const written =
            writeGeneratedFile(
                dockerignorePath,
                template,
                options
            );


        if (!written) {
            return;
        }


        console.log(
            `✓ .dockerignore generated: ${dockerignorePath}`
        );


    } catch (error) {

        console.log(
            `❌ Failed to generate .dockerignore for: ${project.path}`
        );

        console.log(
            `   ${error.message}`
        );
    }
}


module.exports =
    generateDockerignore;