const scanProjects = require("../core/projectScanner");
const analyzeProjects = require("../core/analyzer");

function init() {
  console.log("🚀 dockerez initialized!");

  const projectPath = process.cwd();

  console.log("\nScanning:");
  console.log(projectPath);

  const projects = scanProjects(projectPath);
  const analyzedProjects = analyzeProjects(projects);

  console.log("\nProjects found:");

  if (analyzedProjects.length === 0) {
    console.log("No projects detected.");
    return;
  }

  analyzedProjects.forEach(project => {
    console.log("\n📦 Project:");
    console.log(project.path);

    console.log("\nType:");
    console.log(project.type);

    console.log("\nManifest:");
    console.log(project.manifest);

    // Node / general frameworks
    if (project.technologies.frameworks.length > 0) {
      console.log("\nFrameworks:");
      project.technologies.frameworks.forEach(technology => {
        console.log(`✓ ${technology.name}`);
      });
    }

    // Frontend technologies
    if (project.technologies.frontend.length > 0) {
      console.log("\nFrontend:");
      project.technologies.frontend.forEach(technology => {
        console.log(`✓ ${technology.name}`);
      });
    }

    // Databases
    if (project.technologies.databases.length > 0) {
      console.log("\nDatabases:");
      project.technologies.databases.forEach(technology => {
        console.log(`✓ ${technology.name}`);
      });
    }

    // Python frameworks
    if (project.technologies.pythonFrameworks.length > 0) {
      console.log("\nPython Frameworks:");
      project.technologies.pythonFrameworks.forEach(technology => {
        console.log(`✓ ${technology.name}`);
      });
    }

if (project.config) {

    console.log("\nDocker Configuration:");

    console.log(
        "Runtime:",
        project.config.runtime
    );

    console.log(
        "Framework:",
        project.config.framework
    );

    console.log(
        "Docker Strategy:",
        project.config.dockerStrategy
    );

    console.log(
        "Package Manager:",
        project.config.packageManager
    );


    if (project.config.development) {

        console.log("\nDevelopment:");

        console.log(
            "Command:",
            project.config.development.command
        );

        console.log(
            "Port:",
            project.config.development.port
        );

    }


    if (project.config.production) {

        console.log("\nProduction:");

        console.log(
            "Command:",
            project.config.production.command || "None"
        );

        console.log(
            "Build Command:",
            project.config.production.buildCommand || "None"
        );

        console.log(
            "Server:",
            project.config.production.server || "None"
        );

        console.log(
            "Port:",
            project.config.production.port
        );

    }


    console.log(
        "\nDatabases:",
        project.config.databases.join(", ") || "None"
    );

}
  });
}

module.exports = init;