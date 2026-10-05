const readPackage = require("./packageReader");

const detectExpress = require("../detectors/express");
const detectNextjs = require("../detectors/next");
const detectVite = require("../detectors/vite");
const detectReact = require("../detectors/react");
const detectFastAPI = require("../detectors/fastapi");

const detectPostgres = require("../detectors/postgres");
const detectMongoDB = require("../detectors/mongodb");
const detectRedis = require("../detectors/redis");

const getProjectConfig = require("../config/projectConfig");


function analyzeProjects(projects) {

    return projects.map(project => {

        let packageData = null;


        if (project.manifest === "package.json") {

            packageData = readPackage(
                project.path
            );

        }


        const frameworkDetectors = [

            detectNextjs,
            detectExpress

        ];


        const frontendDetectors = [

            detectVite,
            detectReact

        ];


        const databaseDetectors = [

            detectPostgres,
            detectMongoDB,
            detectRedis

        ];


        const pythonDetectors = [

            detectFastAPI

        ];


        const frameworks = project.type === "node"

            ? frameworkDetectors
                .map(
                    detector => detector(packageData)
                )
                .filter(
                    result => result.detected
                )

            : [];


        const frontend = project.type === "node"

            ? frontendDetectors
                .map(
                    detector => detector(packageData)
                )
                .filter(
                    result => result.detected
                )

            : [];


        const databases = project.type === "node"

            ? databaseDetectors
                .map(
                    detector => detector(packageData)
                )
                .filter(
                    result => result.detected
                )

            : [];


        const pythonFrameworks = project.type === "python"

            ? pythonDetectors
                .map(
                    detector => detector(project)
                )
                .filter(
                    result => result.detected
                )

            : [];


        const analyzedProject = {

            ...project,

            packageData,

            technologies: {

                frameworks,

                frontend,

                databases,

                pythonFrameworks

            }

        };


        analyzedProject.config =
            getProjectConfig(
                analyzedProject
            );


        return analyzedProject;

    });

}


module.exports = analyzeProjects;