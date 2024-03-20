# NestJS Orchestrator

NestJS Orchestrator is a lightweight command-line tool that simplifies the generation of modules, services, controllers, and entities in NestJS using a single directory to organize features in a more modular way.

## Prerequisites

- This tool is designed to be run at the root of a NestJS project. Please ensure you're in the root directory of your project before running the `orchestrator` command.
- For generating entities with this package, the entities array used for TypeORM needs to be located at `src/config/typeorm/entities.ts`. Here's an example of the syntax should be used in this file:

```typescript
import { Item } from '../../item/item.entity';

export const entities = [Item];
```

- Please ensure this file and structure is in place before using the orchestrator command to generate entities.
- While not necessary, we recommend having nest-cli installed globally for the best performance of the tool. You can install it using the following command:

```bash
npm install -g @nestjs/cli
```

## Installation

Install it globally using npm:

```bash
npm install -g nestjs-orchestrator
```

## Usage

```bash
orchestrator [option] [name]
```

### Options

- `-a, --all    [name]`   Generate a module, entity, service and controller with the given name
- `-m, --module [name]`   Generate a module, service, and controller with the given name
- `-e, --entity [name]`   Generate an entity with the given name
- `-h, --help`            Display the help message

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