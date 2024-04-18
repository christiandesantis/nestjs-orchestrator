#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require(path.resolve(path.dirname(__filename), './package.json'));
const program = require('commander');

const cmd = 'npx nest';

program
  .version(packageJson.version)
  .description('A CLI tool for orchestrating NestJS projects')
  .option('-m, --module <name>', 'Generate a module, service, and controller with the given name')
  .option('-e, --entity <name>', 'Generate an entity with the given name')
  .option('-a, --all <name>', 'Generate a module, service, controller and entity with the given name')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

if (program.module) {
  // Execute the command to generate the module
  execSync(`${cmd} g module ${program.module}`, { stdio: 'inherit' });
  
  // Execute the command to generate the service
  execSync(`${cmd} g service ${program.module}`, { stdio: 'inherit' });

  // Execute the command to generate the controller
  execSync(`${cmd} g controller ${program.module}`, { stdio: 'inherit' });

  // Create the service and controller directories
  fs.mkdirSync(path.join('src', program.module, 'service'), { recursive: true });
  fs.mkdirSync(path.join('src', program.module, 'controller'), { recursive: true });

  // Move the service and service.spec files to their respective directory
  fs.renameSync(
    path.join('src', program.module, `${program.module}.service.ts`),
    path.join('src', program.module, 'service', `${program.module}.service.ts`)
  );
  fs.renameSync(
    path.join('src', program.module, `${program.module}.service.spec.ts`),
    path.join('src', program.module, 'service', `${program.module}.service.spec.ts`)
  );

  // Move the controller and controller.spec files to their respective directory
  fs.renameSync(
    path.join('src', program.module, `${program.module}.controller.ts`),
    path.join('src', program.module, 'controller', `${program.module}.controller.ts`)
  );
  fs.renameSync(
    path.join('src', program.module, `${program.module}.controller.spec.ts`),
    path.join('src', program.module, 'controller', `${program.module}.controller.spec.ts`)
  );

  // Update the generated module file
  const moduleFilePath = path.join('src', program.module, `${program.module}.module.ts`);
  let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
  // Add a comma after the controllers array
  moduleFileContent = moduleFileContent.replace(/(controllers: \[[^\]]*\])/g, `$1,`);
  
  // Update the import paths for the service and controller
  moduleFileContent = moduleFileContent.replace(
    `'./${program.module}.service';`,
    `'./service/${program.module}.service';`
  );
  moduleFileContent = moduleFileContent.replace(
    `'./${program.module}.controller';`,
    `'./controller/${program.module}.controller';`
  );
  
  // Save the updated module file
  fs.writeFileSync(moduleFilePath, moduleFileContent);
}

if (program.entity || program.all) {
  // Generate entity file
  const entityName = program.entity || program.all;
  const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
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
  // Write entity file
  fs.writeFileSync(entityFilePath, entityFileContent);

  // Update module.ts
  const moduleFilePath = path.join('src', entityName, `${entityName}.module.ts`);
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
  // Save the updated module file
  fs.writeFileSync(moduleFilePath, moduleFileContent);
}