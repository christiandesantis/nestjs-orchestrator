# NestJS Orchestrator

NestJS Orchestrator is a lightweight command-line tool that simplifies the generation of modules, services, controllers, and entities in NestJS using a single directory to organize features in a more modular way. It can be installed globally and used as a standalone command, or installed as a dependency in a NestJS project and run with `npm run orchestrator`.

## Prerequisites

- This tool is designed to be run at the root of a NestJS project. Please ensure you're in the root directory of your project before running the `orchestrator` command.

- Please ensure this file and structure is in place before using the orchestrator command to generate entities.
- While not necessary, we recommend having nest-cli installed globally for the best performance of the tool. You can install it using the following command:

```bash
npm install -g @nestjs/cli
```

## Installation

### Global Installation

Install it globally using npm:

```bash
npm install -g nestjs-orchestrator
```

### Local Installation

Install it as a development dependency in your project:

```bash
npm install -D nestjs-orchestrator
```

Then, add a script in your `package.json` file to run the orchestrator:

```json
"scripts": {
  "orchestrator": "orchestrator"
}
```

## Usage

### Global Usage

```bash
orchestrator [option] [name]
```

### Local Usage

```bash
npm run orchestrator -- [option] [name]
```

### Options

- `-a, --all    [name]`   Generate a module, entity, service and controller with the given name
- `-m, --module [name]`   Generate a module, service, and controller with the given name
- `-e, --entity [name]`   Generate an entity with the given name
- `-h, --help`            Display the help message
- `-v, --version`         Display the version of this package

If no option is provided, it will assume `-a` or `--all`, generating a module, service, controller and entity with the given name.

### Examples

Generate a module, entity, service and controller named 'user':

```bash
orchestrator user
```

or

```bash
orchestrator -a user
```

Generate a module, service, and controller named 'user':

```bash
orchestrator -m user
```

Generate an entity named 'user':

```bash
orchestrator -e user
```

## License

This project is licensed under the MIT License.