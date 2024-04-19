# NestJS Orchestrator

NestJS Orchestrator is a lightweight command-line tool that simplifies the generation of modules, services, controllers, and TypeORM entities in NestJS using a single directory to organize features in a more modular way. It can be installed globally and used as a standalone command, or installed as a dependency in a NestJS project and run with `npm run orchestrator`.

## Prerequisites

- This tool is designed to be run at the root of a NestJS project. Please ensure you're in the root directory of your project before running the `orchestrator` command.

- For generated entities to work, TypeORM needs to be installed and configured in your NestJS project.

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

- `-a, --all    <name>`       Generate a module, controller, service and TypeORM entity with the given name
- `-m, --module <name>`       Generate a module with the given name
- `-c, --controller <name>`   Generate a module and controller with the given name
- `-s, --service <name>`      Generate a module and service with the given name
- `-e, --entity <name>`       Generate a TypeORM entity with the given name
- `-h, --help`                Display this help message
- `-V, --version`             Display the version of this package

If no option is provided, it will generate a module, controller and service with the given name.

### Examples

Generate a module named `user.module.ts` inside `src/user/`, a controller named `user.controller.ts` inside `src/user/controller/` and a service named `user.service.ts` inside `src/user/service/`:

```bash
orchestrator user
```

Generate a module named `user.module.ts` inside `src/user/`, a controller named `user.controller.ts` inside `src/user/controller/`, a service named `user.service.ts` inside `src/user/service/` and a TypeORM entity named `user.entity.ts` inside `src/user/` automatically imported and configured in the recently generated `user.module.ts`:

```bash
orchestrator -a user
```

or

```bash
orchestrator --all user
```

Generate a module named `user.module.ts` inside `src/user/`:

```bash
orchestrator -m user
```

or

```bash
orchestrator --module user
```

Generate a module named `user.module.ts` inside `src/user/` and a controller named `user.controller.ts` inside `src/user/controller/`:

```bash
orchestrator -c user
```

or

```bash
orchestrator --controller user
```

Generate a module named `user.module.ts` inside `src/user/` and a service named `user.service.ts` inside `src/user/service/`:

```bash
orchestrator -s user
```

or

```bash
orchestrator --service user
```

Generate a TypeORM entity named `user.entity.ts` inside `src/user/`:

```bash
orchestrator -e user
```

or

```bash
orchestrator --entity user
```

## License

This project is licensed under the MIT License.