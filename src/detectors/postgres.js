const POSTGRES_PACKAGES = [
    "pg",
    "pg-promise",
    "postgres",
    "sequelize",
    "typeorm",
    "@prisma/client"
];


function detectPostgres(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "PostgreSQL"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    const matchedPackage = POSTGRES_PACKAGES.find(
        packageName => dependencies[packageName]
    );

    return {
        detected: Boolean(matchedPackage),
        name: "PostgreSQL",
        matchedPackage: matchedPackage || null
    };
}


module.exports = detectPostgres;