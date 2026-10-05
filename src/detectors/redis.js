const REDIS_PACKAGES = [
    "redis",
    "ioredis"
];


function detectRedis(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "Redis"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    const matchedPackage = REDIS_PACKAGES.find(
        packageName => dependencies[packageName]
    );

    return {
        detected: Boolean(matchedPackage),
        name: "Redis",
        matchedPackage: matchedPackage || null
    };
}


module.exports = detectRedis;