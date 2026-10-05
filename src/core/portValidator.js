const {
    isPortAvailable
} = require("./portManager");

async function validatePorts(
    analyzedProjects
) {
    const ports = [];

    analyzedProjects.forEach(
        project => {

            const port =
                project.config
                    ?.production
                    ?.port;

            if (!port) {
                return;
            }

            ports.push({
                service:
                    project.path,
                port
            });
        }
    );

    ports.push(
        {
            service: "postgres",
            port: 5432
        },
        {
            service: "mongodb",
            port: 27017
        },
        {
            service: "redis",
            port: 6379
        }
    );

    const warnings = [];

    for (
        const item of ports
    ) {
        const available =
            await isPortAvailable(
                item.port
            );

        if (!available) {
            warnings.push(item);
        }
    }

    return warnings;
}

module.exports =
    validatePorts;