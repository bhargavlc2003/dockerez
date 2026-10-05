function detectReact(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "React"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    return {
        detected: Boolean(dependencies.react),
        name: "React"
    };
}


module.exports = detectReact;