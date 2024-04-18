#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const cmd = 'npx nest';

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
    // Execute the command to generate the module
    execSync(`${cmd} g module ${nameArg}`, { stdio: 'inherit' });
  
    // Execute the command to generate the service
    execSync(`${cmd} g service ${nameArg}`, { stdio: 'inherit' });

    // Execute the command to generate the controller
    execSync(`${cmd} g controller ${nameArg}`, { stdio: 'inherit' });

    // Create the service and controller directories
    fs.mkdirSync(path.join('src', nameArg, 'service'), { recursive: true });
    fs.mkdirSync(path.join('src', nameArg, 'controller'), { recursive: true });

    // Move the service and controller files to their respective directories
    fs.renameSync(
      path.join('src', nameArg, `${nameArg}.service.ts`),
      path.join('src', nameArg, 'service', `${nameArg}.service.ts`)
    );
    fs.renameSync(
      path.join('src', nameArg, `${nameArg}.controller.ts`),
      path.join('src', nameArg, 'controller', `${nameArg}.controller.ts`)
    );

    // Move the service and controller spec files to their respective directories
    fs.renameSync(
      path.join('src', nameArg, `${nameArg}.service.spec.ts`),
      path.join('src', nameArg, 'service', `${nameArg}.service.spec.ts`)
    );
    fs.renameSync(
      path.join('src', nameArg, `${nameArg}.controller.spec.ts`),
      path.join('src', nameArg, 'controller', `${nameArg}.controller.spec.ts`)
    );

    // Update the generated module file
    const moduleFilePath = path.join('src', nameArg, `${nameArg}.module.ts`);
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
    // Add a comma after the controllers array
    moduleFileContent = moduleFileContent.replace(/(controllers: \[[^\]]*\])/g, `$1,`);
  
    // Update the import paths for the service and controller
    moduleFileContent = moduleFileContent.replace(
      `'./${nameArg}.service';`,
      `'./service/${nameArg}.service';`
    );
    moduleFileContent = moduleFileContent.replace(
      `'./${nameArg}.controller';`,
      `'./controller/${nameArg}.controller';`
    );
    
    fs.writeFileSync(moduleFilePath, moduleFileContent);
  }

  const entityName = nameArg;
  if (!hasFlag || args.includes('-e') || args.includes('--entity') || args.includes('-a') || args.includes('--all')) {
    const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    // Generate entity file
    const entityFilePath = path.join('src', entityName, `${entityName}.entity.ts`);
    const entityFileContent = `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    // Update module.ts
    const moduleFilePath = path.join('src', nameArg, `${nameArg}.module.ts`);
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');

    // Add import statements
    moduleFileContent = `import { ${entityNameCapitalized} } from './${entityName}.entity';\nimport { TypeOrmModule } from '@nestjs/typeorm';\n` + moduleFileContent;

    // Add entity to TypeOrmModule.forFeature in imports array
    if (!moduleFileContent.includes('imports:')) {
      // If there's no imports array, add it
      moduleFileContent = moduleFileContent.replace('@Module({', `@Module({\n  imports: [TypeOrmModule.forFeature([${entityNameCapitalized}])],`);
    } else if (moduleFileContent.includes('imports: [],')) {
      // If the imports array is empty, add the entity
      moduleFileContent = moduleFileContent.replace('imports: [],', `imports: [TypeOrmModule.forFeature([${entityNameCapitalized}])],`);
    } else {
      // If the imports array is not empty, add the entity
      moduleFileContent = moduleFileContent.replace(/imports: \[(.*)\],/, `imports: [$1, TypeOrmModule.forFeature([${entityNameCapitalized}])],`);
    }

    fs.writeFileSync(moduleFilePath, moduleFileContent);
  }
}

if (require.main === module) {
  // The script is being run directly, call the function with process arguments
  orchestrator(process.argv.slice(2));
} else {
  // The script is being required as a module, export the function
  module.exports = orchestrator;
}
