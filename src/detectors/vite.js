function detectVite(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "Vite"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    return {
        detected: Boolean(dependencies.vite),
        name: "Vite"
    };
}


module.exports = detectVite;