const MONGODB_PACKAGES = [
    "mongodb",
    "mongoose",
    "mongodb-memory-server"
];


function detectMongoDB(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "MongoDB"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    const matchedPackage = MONGODB_PACKAGES.find(
        packageName => dependencies[packageName]
    );

    return {
        detected: Boolean(matchedPackage),
        name: "MongoDB",
        matchedPackage: matchedPackage || null
    };
}


module.exports = detectMongoDB;