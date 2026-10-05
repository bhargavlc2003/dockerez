const { Command } = require("commander");

const init = require("./commands/init");
const generate = require("./commands/generate");
const clean = require("./commands/clean");
const doctor = require("./commands/doctor");

const program = new Command();

program
    .name("dockerez")
    .description("Automatically generate Docker configurations")
    .version("1.0.0");


/*
 * --------------------------------------------------
 * INIT
 * --------------------------------------------------
 */

program
    .command("init")
    .description("Analyze the current project")
    .action(init);


/*
 * --------------------------------------------------
 * GENERATE
 * --------------------------------------------------
 */

program
    .command("generate")
    .description("Generate Docker configuration files")
    .option(
        "-f, --force",
        "Overwrite existing generated files"
    )
    .option(
        "--no-compose",
        "Generate Dockerfiles and .dockerignore files without Docker Compose"
    )
    .action((options) => {

        generate(options);

    });


/*
 * --------------------------------------------------
 * CLEAN
 * --------------------------------------------------
 */

program
    .command("clean")
    .description("Remove Docker configuration files")
    .option(
        "-f, --force",
        "Remove files without confirmation"
    )
    .action((options) => {

        clean(options);

    });


/*
 * --------------------------------------------------
 * DOCTOR
 * --------------------------------------------------
 */

program
    .command("doctor")
    .description("Check Docker and dockerez environment")
    .action(doctor);


/*
 * --------------------------------------------------
 * HELP / VERSION
 * --------------------------------------------------
 *
 * Commander automatically provides:
 *
 *   dockerez --help
 *   dockerez generate --help
 *   dockerez --version
 *
 */


program.parse();