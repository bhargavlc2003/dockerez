const net = require("net");

function isPortAvailable(port) {
    return new Promise(resolve => {

        const server =
            net.createServer();

        server.once(
            "error",
            () => {
                resolve(false);
            }
        );

        server.once(
            "listening",
            () => {
                server.close(
                    () => resolve(true)
                );
            }
        );

        server.listen(
            port,
            "0.0.0.0"
        );
    });
}

async function findAvailablePort(
    preferredPort
) {
    let port = preferredPort;

    while (
        !(await isPortAvailable(port))
    ) {
        port++;
    }

    return port;
}

module.exports = {
    isPortAvailable,
    findAvailablePort
};