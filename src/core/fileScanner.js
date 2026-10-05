const fs = require("fs");
const path = require("path");


function scanProject(directory) {

    return {
        hasPackageJson: fs.existsSync(
            path.join(directory, "package.json")
        ),

        hasRequirements: fs.existsSync(
            path.join(directory, "requirements.txt")
        ),

        hasPyProject: fs.existsSync(
            path.join(directory, "pyproject.toml")
        )
    };

}


module.exports = scanProject;