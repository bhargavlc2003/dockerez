const fs = require("fs");
const path = require("path");

const {
    writeGeneratedFile
} = require("../core/fileWriter");


function generateCompose(
    projectRoot,
    analyzedProjects,
    options = {}
) {

    try {

        if (!projectRoot) {

            console.log(
                "⚠️ Cannot generate docker-compose.yml: missing project root."
            );

            return;
        }


        if (
            !analyzedProjects ||
            analyzedProjects.length === 0
        ) {

            console.log(
                "⚠️ Cannot generate docker-compose.yml: no projects found."
            );

            return;
        }


        const services = {};


        /*
         * Create application services
         */

        analyzedProjects.forEach(project => {

            if (!project.config) {
                return;
            }


            if (!project.config.dockerStrategy) {
                return;
            }


            const serviceName =
                getServiceName(project);


            services[serviceName] =
                createApplicationService(
                    project,
                    projectRoot
                );

        });


        /*
         * Add database services
         */

        addDatabaseServices(
            services,
            analyzedProjects
        );


        /*
         * Make sure at least one service exists
         */

        if (
            Object.keys(services).length === 0
        ) {

            console.log(
                "⚠️ No Docker services detected."
            );

            return;
        }


        /*
         * Build compose YAML
         */

        const composeContent =
            buildComposeFile(
                services
            );


        const composePath =
            path.join(
                projectRoot,
                "docker-compose.yml"
            );


        /*
         * Write file
         */

        const written =
            writeGeneratedFile(
                composePath,
                composeContent,
                options
            );


        if (!written) {
            return;
        }


        console.log(
            `✓ docker-compose.yml generated: ${composePath}`
        );

    }

    catch (error) {

        console.log(
            "❌ Failed to generate docker-compose.yml"
        );

        console.log(
            `   ${error.message}`
        );

    }

}


/*
 * --------------------------------------------------
 * SERVICE NAME
 * --------------------------------------------------
 */

function getServiceName(project) {

    return path
        .basename(project.path)
        .toLowerCase()
        .replace(
            /[^a-z0-9-_]/g,
            "-"
        );

}


/*
 * --------------------------------------------------
 * APPLICATION SERVICE
 * --------------------------------------------------
 */

function createApplicationService(
    project,
    projectRoot
) {

    const config =
        project.config;


    const productionPort =
        config.production?.port;


    const service = {

        build: {

            context:
                getRelativePath(
                    projectRoot,
                    project.path
                )

        },

        restart:
            "unless-stopped"

    };


    /*
     * Host port mapping
     *
     * Vite:
     *   container = nginx :80
     *   host       = 5173
     *
     * Everything else:
     *   host = container production port
     */

    if (config.framework === "vite") {

        service.ports = [
            "5173:80"
        ];

    }

    else if (productionPort) {

        service.ports = [
            `${productionPort}:${productionPort}`
        ];

    }


    /*
     * Database dependencies
     */

    const dependencies =
        getApplicationDependencies(
            project
        );


    if (
        Object.keys(dependencies).length > 0
    ) {

        service.depends_on =
            dependencies;

    }


    /*
     * Database environment variables
     */

    const environment =
        getDatabaseEnvironment(
            project
        );


    if (
        Object.keys(environment).length > 0
    ) {

        service.environment =
            environment;

    }


    return service;

}


/*
 * --------------------------------------------------
 * APPLICATION DEPENDENCIES
 * --------------------------------------------------
 */

function getApplicationDependencies(
    project
) {

    const dependencies = {};


    const databases =
        project.config.databases || [];


    if (
        databases.includes(
            "postgresql"
        )
    ) {

        dependencies.postgres = {

            condition:
                "service_healthy"

        };

    }


    if (
        databases.includes(
            "mongodb"
        )
    ) {

        dependencies.mongodb = {

            condition:
                "service_healthy"

        };

    }


    if (
        databases.includes(
            "redis"
        )
    ) {

        dependencies.redis = {

            condition:
                "service_healthy"

        };

    }


    return dependencies;

}


/*
 * --------------------------------------------------
 * DATABASE SERVICES
 * --------------------------------------------------
 */

function addDatabaseServices(
    services,
    analyzedProjects
) {

    const databases =
        new Set();


    /*
     * Find all databases used by
     * all detected projects.
     */

    analyzedProjects.forEach(
        project => {

            if (!project.config) {
                return;
            }


            const projectDatabases =
                project.config.databases || [];


            projectDatabases.forEach(
                database => {

                    databases.add(
                        database
                    );

                }
            );

        }
    );


    /*
     * PostgreSQL
     */

    if (
        databases.has(
            "postgresql"
        )
    ) {

        services.postgres = {

            image:
                "postgres:17",

            restart:
                "unless-stopped",

            ports: [
                "5432:5432"
            ],

            environment: {

                POSTGRES_USER:
                    "${POSTGRES_USER}",

                POSTGRES_PASSWORD:
                    "${POSTGRES_PASSWORD}",

                POSTGRES_DB:
                    "${POSTGRES_DB}"

            },

            volumes: [

                "postgres_data:/var/lib/postgresql/data"

            ],

            healthcheck: {

                test: [

                    "CMD-SHELL",

                    "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"

                ],

                interval:
                    "5s",

                timeout:
                    "5s",

                retries:
                    10,

                start_period:
                    "10s"

            }

        };

    }


    /*
     * MongoDB
     */

    if (
        databases.has(
            "mongodb"
        )
    ) {

        services.mongodb = {

            image:
                "mongo:8",

            restart:
                "unless-stopped",

            ports: [
                "27017:27017"
            ],

            volumes: [

                "mongodb_data:/data/db"

            ],

            healthcheck: {

                test: [

                    "CMD",

                    "mongosh",

                    "--eval",

                    "db.adminCommand('ping')"

                ],

                interval:
                    "5s",

                timeout:
                    "5s",

                retries:
                    10,

                start_period:
                    "10s"

            }

        };

    }


    /*
     * Redis
     */

    if (
        databases.has(
            "redis"
        )
    ) {

        services.redis = {

            image:
                "redis:8",

            restart:
                "unless-stopped",

            ports: [
                "6379:6379"
            ],

            healthcheck: {

                test: [

                    "CMD",

                    "redis-cli",

                    "ping"

                ],

                interval:
                    "5s",

                timeout:
                    "5s",

                retries:
                    10,

                start_period:
                    "5s"

            }

        };

    }

}


/*
 * --------------------------------------------------
 * DATABASE ENVIRONMENT VARIABLES
 * --------------------------------------------------
 */

function getDatabaseEnvironment(
    project
) {

    const environment = {};


    const databases =
        project.config.databases || [];


    /*
     * PostgreSQL
     */

    if (
        databases.includes(
            "postgresql"
        )
    ) {

        environment.DATABASE_URL =
            "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}";

    }


    /*
     * MongoDB
     */

    if (
        databases.includes(
            "mongodb"
        )
    ) {

        environment.MONGODB_URI =
            "mongodb://mongodb:27017/app";

    }


    /*
     * Redis
     */

    if (
        databases.includes(
            "redis"
        )
    ) {

        environment.REDIS_URL =
            "redis://redis:6379";

    }


    return environment;

}


/*
 * --------------------------------------------------
 * RELATIVE BUILD PATH
 * --------------------------------------------------
 */

function getRelativePath(
    root,
    projectPath
) {

    const relativePath =
        path.relative(
            root,
            projectPath
        );


    if (!relativePath) {

        return ".";

    }


    return `./${relativePath.replace(
        /\\/g,
        "/"
    )}`;

}


/*
 * --------------------------------------------------
 * BUILD COMPOSE FILE
 * --------------------------------------------------
 */

function buildComposeFile(
    services
) {

    let output = "";


    output +=
        "services:\n";


    /*
     * Services
     */

    Object.entries(
        services
    ).forEach(
        ([name, service]) => {

            output +=
                `  ${name}:\n`;


            /*
             * Build
             */

            if (service.build) {

                output +=
                    "    build:\n";

                output +=
                    `      context: ${service.build.context}\n`;

            }


            /*
             * Image
             */

            if (service.image) {

                output +=
                    `    image: ${service.image}\n`;

            }


            /*
             * Restart
             */

            if (service.restart) {

                output +=
                    `    restart: ${service.restart}\n`;

            }


            /*
             * Ports
             */

            if (
                service.ports &&
                service.ports.length > 0
            ) {

                output +=
                    "    ports:\n";


                service.ports.forEach(
                    port => {

                        output +=
                            `      - "${port}"\n`;

                    }
                );

            }


            /*
             * Environment
             */

            if (service.environment) {

                output +=
                    "    environment:\n";


                Object.entries(
                    service.environment
                ).forEach(
                    ([key, value]) => {

                        output +=
                            `      ${key}: ${value}\n`;

                    }
                );

            }


            /*
             * depends_on
             */

            if (service.depends_on) {

                output +=
                    "    depends_on:\n";


                Object.entries(
                    service.depends_on
                ).forEach(
                    ([dependency, config]) => {

                        output +=
                            `      ${dependency}:\n`;

                        output +=
                            `        condition: ${config.condition}\n`;

                    }
                );

            }


            /*
             * Healthcheck
             */

            if (service.healthcheck) {

                output +=
                    "    healthcheck:\n";


                output +=
                    "      test:\n";


                service.healthcheck.test.forEach(
                    value => {

                        output +=
                            `        - "${value}"\n`;

                    }
                );


                output +=
                    `      interval: ${service.healthcheck.interval}\n`;


                output +=
                    `      timeout: ${service.healthcheck.timeout}\n`;


                output +=
                    `      retries: ${service.healthcheck.retries}\n`;


                output +=
                    `      start_period: ${service.healthcheck.start_period}\n`;

            }


            /*
             * Volumes
             */

            if (service.volumes) {

                output +=
                    "    volumes:\n";


                service.volumes.forEach(
                    volume => {

                        output +=
                            `      - "${volume}"\n`;

                    }
                );

            }


            output +=
                "\n";

        }
    );


    /*
     * Named volumes
     */

    const volumes =
        getRequiredVolumes(
            services
        );


    if (
        volumes.length > 0
    ) {

        output +=
            "volumes:\n";


        volumes.forEach(
            volume => {

                output +=
                    `  ${volume}:\n`;

            }
        );


        output +=
            "\n";

    }


    return output;

}


/*
 * --------------------------------------------------
 * REQUIRED VOLUMES
 * --------------------------------------------------
 */

function getRequiredVolumes(
    services
) {

    const volumes =
        new Set();


    Object.values(
        services
    ).forEach(
        service => {

            if (!service.volumes) {
                return;
            }


            service.volumes.forEach(
                volume => {

                    const volumeName =
                        volume.split(":")[0];


                    volumes.add(
                        volumeName
                    );

                }
            );

        }
    );


    return Array.from(
        volumes
    );

}


module.exports =
    generateCompose;