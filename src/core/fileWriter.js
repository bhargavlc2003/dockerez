const fs = require("fs");

function writeGeneratedFile(
    filePath,
    content,
    options = {}
) {
    const {
        force = false
    } = options;

    if (
        fs.existsSync(filePath) &&
        !force
    ) {
        console.log(
            `⚠️ Skipping existing file: ${filePath}`
        );

        console.log(
            "   Use --force to overwrite it."
        );

        return false;
    }

    fs.writeFileSync(
        filePath,
        content
    );

    return true;
}

module.exports = {
    writeGeneratedFile
};