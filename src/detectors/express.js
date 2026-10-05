function detectExpress(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "Express"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    return {
        detected: Boolean(dependencies.express),
        name: "Express"
    };
}


module.exports = detectExpress;