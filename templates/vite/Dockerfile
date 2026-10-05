const fs = require("fs");
const path = require("path");

const {
    writeGeneratedFile
} = require("../core/fileWriter");


function generateDockerfile(
    project,
    options = {}
) {

    try {

        if (
            !project ||
            !project.config
        ) {

            console.log(
                "⚠️ Cannot generate Dockerfile: missing project configuration."
            );

            return;

        }


        const strategy =
            project.config.dockerStrategy;


        if (!strategy) {

            console.log(
                `⚠️ No Docker strategy found for: ${project.path}`
            );

            return;

        }


        const templatePath =
            path.join(
                __dirname,
                "../../templates",
                strategy,
                "Dockerfile"
            );


        if (
            !fs.existsSync(templatePath)
        ) {

            console.log(
                `⚠️ Dockerfile template not found for strategy: ${strategy}`
            );

            return;

        }


        const dockerfilePath =
            path.join(
                project.path,
                "Dockerfile"
            );


        let template =
            fs.readFileSync(
                templatePath,
                "utf8"
            );


        template =
            applyPackageManager(
                template,
                project.config.packageManager
            );


        const written =
            writeGeneratedFile(
                dockerfilePath,
                template,
                options
            );


        if (!written) {
            return;
        }


        console.log(
            `✓ Dockerfile generated: ${dockerfilePath}`
        );

    }

    catch (error) {

        console.log(
            `❌ Failed to generate Dockerfile for: ${project.path}`
        );

        console.log(
            `   ${error.message}`
        );

    }

}


function applyPackageManager(
    template,
    packageManager
) {

    if (
        packageManager === "yarn"
    ) {

        return template
            .replace(
                /COPY package\*\.json \.\/\n/,
                "COPY package.json yarn.lock ./\n"
            )
            .replace(
                "RUN npm ci",
                "RUN yarn install --frozen-lockfile"
            );

    }


    if (
        packageManager === "pnpm"
    ) {

        return template
            .replace(
                /COPY package\*\.json \.\/\n/,
                "COPY package.json pnpm-lock.yaml ./\n"
            )
            .replace(
                "RUN npm ci",
                "RUN corepack enable && pnpm install --frozen-lockfile"
            );

    }


    return template;

}


module.exports =
    generateDockerfile;