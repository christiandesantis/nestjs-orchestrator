#!/usr/bin/env node

const { execSync } = require('child_process');
const args = process.argv.slice(2);
const cmd = 'nest';

function orchestrator() {
  const displayHelp = () => {
    console.log(`
      Usage: nestjs-orchestrator [option] [argument]
      
      -m, --module [name]   Generate a module, service, and controller with the given name
      -e, --entity [name]   Generate an entity with the given name
      -a, --all    [name]   Generate a module, service, controller and entity with the given name
      -h, --help            Display this help message

      If no option is provided, it will assume -a or --all, generating a module, service, controller and entity with the given name.
    `);
    process.exit(1);
  };

  const flags = ['-m', '--module', '-e', '--entity', '-a', '--all', '-h', '--help'];
  const hasFlag = args.some(arg => flags.includes(arg));

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    displayHelp();
  }

  // Get the name argument
  const nameArg = args.find(arg => !flags.includes(arg));

  if (!nameArg && !args.includes('-h') && !args.includes('--help')) {
    console.error('Error: Name argument is required.');
    displayHelp();
  }

  if (!hasFlag || args.includes('-m') || args.includes('--module')) {
    execSync(`${cmd} g module ${nameArg}`, { stdio: 'inherit' });
    execSync(`${cmd} g service ${nameArg}`, { stdio: 'inherit' });
    execSync(`${cmd} g controller ${nameArg}`, { stdio: 'inherit' });
  }

  const entityName = nameArg;
  if (!hasFlag || args.includes('-e') || args.includes('--entity') || args.includes('-a') || args.includes('--all')) {
    const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    const fs = require('fs');
    const path = require('path');

    // Generate entity file
    const entityFilePath = path.join('src', entityName, `${entityName}.entity.ts`);
    const entityFileContent = `
      import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

      @Entity()
      export class ${entityNameCapitalized} {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        name: string;

        @Column({ nullable: true })
        description: string;
      }
    `;
    fs.writeFileSync(entityFilePath, entityFileContent);

    // Update entities.ts
    const entitiesFilePath = path.join('src', 'config', 'typeorm', 'entities.ts');
    let entitiesFileContent = fs.readFileSync(entitiesFilePath, 'utf8');

    // Add import statement
    entitiesFileContent = `import { ${entityNameCapitalized} } from '../../${entityName}/${entityName}.entity';\n` + entitiesFileContent;

    // Add entity to entities array
    if (entitiesFileContent.includes('export const entities = [];')) {
      entitiesFileContent = entitiesFileContent.replace('export const entities = [];', `export const entities = [${entityNameCapitalized}];`);
    } else {
      entitiesFileContent = entitiesFileContent.replace(/export const entities = \[(.*)\];/, `export const entities = [$1, ${entityNameCapitalized}];`);
    }

    fs.writeFileSync(entitiesFilePath, entitiesFileContent);
  }
}

if (require.main === module) {
  // The script is being run directly, call the function with process arguments
  orchestrator(process.argv.slice(2));
} else {
  // The script is being required as a module, export the function
  module.exports = orchestrator;
}
