function getNodeConfig(project) {

    const packageData = project.packageData;

    if (!packageData) {
        return null;
    }


    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };


    let framework = null;
    let dockerStrategy = null;


    if (dependencies.next) {

        framework = "next";
        dockerStrategy = "next";

    } else if (dependencies.express) {

        framework = "express";
        dockerStrategy = "express";

    } else if (dependencies.vite) {

        framework = "vite";
        dockerStrategy = "vite";

    }


    const packageManager =
        detectPackageManager(project);


    const development =
        detectDevelopmentConfig(
            packageData,
            framework
        );


    const production =
        detectProductionConfig(
            packageData,
            framework
        );


    return {

        runtime: "node",

        framework,

        dockerStrategy,

        packageManager,

        development,

        production

    };

}


/*
 * Detect the package manager used
 * by the project.
 */
function detectPackageManager(project) {

    const fs = require("fs");
    const path = require("path");


    if (
        fs.existsSync(
            path.join(
                project.path,
                "pnpm-lock.yaml"
            )
        )
    ) {

        return "pnpm";

    }


    if (
        fs.existsSync(
            path.join(
                project.path,
                "yarn.lock"
            )
        )
    ) {

        return "yarn";

    }


    if (
        fs.existsSync(
            path.join(
                project.path,
                "package-lock.json"
            )
        )
    ) {

        return "npm";

    }


    return "npm";

}


/*
 * Detect development configuration.
 */
function detectDevelopmentConfig(
    packageData,
    framework
) {

    let command = null;
    let port = null;


    if (
        packageData.scripts?.dev
    ) {

        command =
            detectDevCommand(
                packageData
            );

    } else if (
        packageData.scripts?.start
    ) {

        command =
            "npm start";

    }


    if (framework === "vite") {

        port = 5173;

    }


    if (framework === "next") {

        port = 3000;

    }


    if (framework === "express") {

        port = 5000;

    }


    return {

        command,

        port

    };

}


/*
 * Detect the development command.
 */
function detectDevCommand(
    packageData
) {

    if (
        packageData.scripts?.dev
    ) {

        return "npm run dev";

    }


    return null;

}


/*
 * Detect production configuration.
 */
function detectProductionConfig(
    packageData,
    framework
) {

    let command = null;
    let buildCommand = null;
    let server = null;
    let port = null;


    if (framework === "vite") {

        buildCommand =
            "npm run build";

        server = "nginx";

        port = 80;

    }


    if (framework === "next") {

        buildCommand =
            "npm run build";

        command =
            "npm start";

        port = 3000;

    }


    if (framework === "express") {

        command =
            detectProductionStartCommand(
                packageData
            );

        port = 5000;

    }


    return {

        command,

        buildCommand,

        server,

        port

    };

}


/*
 * Detect the production start command.
 */
function detectProductionStartCommand(
    packageData
) {

    if (
        packageData.scripts?.start
    ) {

        return "npm start";

    }


    return null;

}


module.exports = getNodeConfig;