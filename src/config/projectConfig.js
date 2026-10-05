const getNodeConfig = require("./nodeConfig");
const getPythonConfig = require("./pythonConfig");


function getProjectConfig(project) {

    if (!project) {
        return null;
    }


    let config = null;


    if (project.type === "node") {

        config = getNodeConfig(project);

    }


    if (project.type === "python") {

        config = getPythonConfig(project);

    }


    if (!config) {
        return null;
    }


    const databases = getDatabases(project);


    return {

        ...config,

        databases

    };

}


function getDatabases(project) {

    const databases = [];


    if (
        project.technologies?.databases
            ?.some(
                database => database.name === "PostgreSQL"
            )
    ) {

        databases.push("postgresql");

    }


    if (
        project.technologies?.databases
            ?.some(
                database => database.name === "MongoDB"
            )
    ) {

        databases.push("mongodb");

    }


    if (
        project.technologies?.databases
            ?.some(
                database => database.name === "Redis"
            )
    ) {

        databases.push("redis");

    }


    return databases;

}


module.exports = getProjectConfig;