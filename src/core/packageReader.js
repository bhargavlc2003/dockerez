const fs = require("fs");
const path = require("path");


function readPackage(projectPath) {

    const packagePath =
        path.join(
            projectPath,
            "package.json"
        );


    if (!fs.existsSync(packagePath)) {

        return null;
    }


    try {

        const content =
            fs.readFileSync(
                packagePath,
                "utf8"
            );


        return JSON.parse(content);

    } catch (error) {

        console.log(
            `⚠️ Could not read package.json: ${packagePath}`
        );

        console.log(
            `   ${error.message}`
        );

        return null;
    }
}


module.exports = readPackage;