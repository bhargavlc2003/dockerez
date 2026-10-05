function detectNextjs(packageData) {

    if (!packageData) {
        return {
            detected: false,
            name: "Next.js"
        };
    }

    const dependencies = {
        ...packageData.dependencies,
        ...packageData.devDependencies
    };

    return {
        detected: Boolean(dependencies.next),
        name: "Next.js"
    };
}


module.exports = detectNextjs;