const fs = require("fs");
const path = require("path");


const IGNORE_FOLDERS = [
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".cache",
    ".vscode",
    ".idea",
    "venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".tox",
    ".eggs",
    ".venv",
    "env",
    ".env",
    "tmp",
    "temp",
    ".DS_Store"
];


function scanDirectory(directory, projects = []) {

    const items = fs.readdirSync(directory);


    for (const item of items) {

        const fullPath = path.join(directory, item);

        const stats = fs.statSync(fullPath);


        // Ignore files
        if (!stats.isDirectory()) {
            continue;
        }


        // Ignore unnecessary folders
        if (IGNORE_FOLDERS.includes(item)) {
            continue;
        }


        const files = fs.readdirSync(fullPath);


        // Node project detection
        if (files.includes("package.json")) {

            projects.push({
                path: fullPath,
                type: "node",
                manifest: "package.json"
            });

        }


        // Python project detection
        if (
            files.includes("requirements.txt") ||
            files.includes("pyproject.toml")
        ) {

            projects.push({
                path: fullPath,
                type: "python",
                manifest: files.includes("requirements.txt")
                    ? "requirements.txt"
                    : "pyproject.toml"
            });

        }


        // Continue searching deeper
        scanDirectory(fullPath, projects);

    }


    return projects;

}


module.exports = scanDirectory;