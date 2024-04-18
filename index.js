#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require(path.resolve(path.dirname(__filename), './package.json'));
const { Command } = require('commander');
const program = new Command();

const cmd = 'npx nest';

program
  .version(packageJson.version)
  .description('A CLI tool for orchestrating NestJS projects');

program
  .command('module <name>')
  .description('Generate a module, service, and controller with the given name')
  .action((name) => {
    execSync(`${cmd} g module ${name}`, { stdio: 'inherit' });
    execSync(`${cmd} g service ${name}`, { stdio: 'inherit' });
    execSync(`${cmd} g controller ${name}`, { stdio: 'inherit' });

    fs.mkdirSync(path.join('src', name, 'service'), { recursive: true });
    fs.mkdirSync(path.join('src', name, 'controller'), { recursive: true });

    fs.renameSync(
      path.join('src', name, `${name}.service.ts`),
      path.join('src', name, 'service', `${name}.service.ts`)
    );
    fs.renameSync(
      path.join('src', name, `${name}.service.spec.ts`),
      path.join('src', name, 'service', `${name}.service.spec.ts`)
    );

    fs.renameSync(
      path.join('src', name, `${name}.controller.ts`),
      path.join('src', name, 'controller', `${name}.controller.ts`)
    );
    fs.renameSync(
      path.join('src', name, `${name}.controller.spec.ts`),
      path.join('src', name, 'controller', `${name}.controller.spec.ts`)
    );

    const moduleFilePath = path.join('src', name, `${name}.module.ts`);
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
    moduleFileContent = moduleFileContent.replace(/(controllers: \[[^\]]*\])/g, `$1,`);
    moduleFileContent = moduleFileContent.replace(
      `'./${name}.service';`,
      `'./service/${name}.service';`
    );
    moduleFileContent = moduleFileContent.replace(
      `'./${name}.controller';`,
      `'./controller/${name}.controller';`
    );
    fs.writeFileSync(moduleFilePath, moduleFileContent);
  });

program
  .command('entity <name>')
  .description('Generate an entity with the given name')
  .action((name) => {
    const entityNameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const entityFilePath = path.join('src', name, `${name}.entity.ts`);
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

    const moduleFilePath = path.join('src', name, `${name}.module.ts`);
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
    moduleFileContent = `import { ${entityNameCapitalized} } from './${name}.entity';\nimport { TypeOrmModule } from '@nestjs/typeorm';\n` + moduleFileContent;
    if (!moduleFileContent.includes('imports:')) {
      moduleFileContent = moduleFileContent.replace('@Module({', `@Module({\n  imports: [TypeOrmModule.forFeature([${entityNameCapitalized}])],`);
    } else if (moduleFileContent.includes('imports: [],')) {
      moduleFileContent = moduleFileContent.replace('imports: [],', `imports: [TypeOrmModule.forFeature([${entityNameCapitalized}])],`);
    } else {
      moduleFileContent = moduleFileContent.replace(/imports: \[(.*)\],/, `imports: [$1, TypeOrmModule.forFeature([${entityNameCapitalized}])],`);
    }
    fs.writeFileSync(moduleFilePath, moduleFileContent);
  });

program
  .command('all <name>')
  .description('Generate a module, service, controller and entity with the given name')
  .action((name) => {
    program.emit('command:module', name);
    program.emit('command:entity', name);
  });

program.parse(process.argv);