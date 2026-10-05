const fs = require("fs");
const path = require("path");


function detectFastAPI(project) {

    if (!project || project.type !== "python") {
        return {
            detected: false,
            name: "FastAPI"
        };
    }


    // Check requirements.txt
    if (project.manifest === "requirements.txt") {

        const requirementsPath = path.join(
            project.path,
            "requirements.txt"
        );

        const requirements = fs.readFileSync(
            requirementsPath,
            "utf-8"
        );


        const packages = requirements
            .split(/\r?\n/)
            .map(line => line.trim().toLowerCase())
            .filter(line => line && !line.startsWith("#"));


        const detected = packages.some(packageName =>
            packageName === "fastapi" ||
            packageName.startsWith("fastapi==") ||
            packageName.startsWith("fastapi>=") ||
            packageName.startsWith("fastapi<") ||
            packageName.startsWith("fastapi~=")
        );


        return {
            detected,
            name: "FastAPI"
        };

    }


    return {
        detected: false,
        name: "FastAPI"
    };

}


module.exports = detectFastAPI;