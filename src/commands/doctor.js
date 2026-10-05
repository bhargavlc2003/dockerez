const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function checkCommand(command, label) {
    try {
        execSync(command, {
            stdio: "ignore"
        });

        console.log(`✓ ${label}`);
        return true;

    } catch {
        console.log(`⚠️ ${label} not available`);
        return false;
    }
}

function checkFile(filePath, label) {
    if (fs.existsSync(filePath)) {
        console.log(`✓ ${label}`);
        return true;
    }

    console.log(`⚠️ ${label} not found`);
    return false;
}

function doctor() {
    try {
        const projectRoot = process.cwd();

        console.log("🩺 dockerez Doctor");
        console.log("\nProject:");
        console.log(projectRoot);

        let issues = 0;

        console.log("\nEnvironment:");

        if (
            !checkCommand(
                "node --version",
                "Node.js"
            )
        ) {
            issues++;
        }

        if (
            !checkCommand(
                "docker --version",
                "Docker"
            )
        ) {
            issues++;
        }

        if (
            !checkCommand(
                "docker compose version",
                "Docker Compose"
            )
        ) {
            issues++;
        }

        console.log("\ndockerez:");

        const templatesPath =
            path.join(
                __dirname,
                "../../templates"
            );

        if (
            !checkFile(
                templatesPath,
                "Docker templates"
            )
        ) {
            issues++;
        }

        console.log("\nProject configuration:");

        const composePath =
            path.join(
                projectRoot,
                "docker-compose.yml"
            );

        const composeYamlPath =
            path.join(
                projectRoot,
                "docker-compose.yaml"
            );

        if (
            fs.existsSync(composePath) ||
            fs.existsSync(composeYamlPath)
        ) {
            console.log(
                "✓ Docker Compose configuration found"
            );
        } else {
            console.log(
                "ℹ️ docker-compose.yml not found"
            );
        }

        console.log("\nResult:");

        if (issues === 0) {
            console.log(
                "✅ No environment problems detected."
            );
        } else {
            console.log(
                `⚠️ ${issues} issue(s) detected.`
            );
        }

    } catch (error) {
        console.log(
            "❌ dockerez Doctor failed."
        );

        console.log(
            `   ${error.message}`
        );
    }
}

module.exports = doctor;