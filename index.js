#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const path = require('path');
const packageJson = require(path.resolve(path.dirname(__filename), './package.json'));
const Module = require('./generator/module');
const Controller = require('./generator/controller');
const Service = require('./generator/service');
const Entity = require('./generator/entity');

const nest = 'npx nest';

program
  .version(packageJson.version)
  .description('A CLI tool for generating NestJS modules, services, controllers, and typeorm entities')
  .option('-m, --module <name>', 'Generate a module with the given name')
  .option('-c, --controller <name>', 'Generate a module and controller with the given name')
  .option('-s, --service <name>', 'Generate a module and service with the given name')
  .option('-e, --entity <name>', 'Generate a typeorm entity with the given name')
  .option('-a, --all <name>', 'Generate a module, controller, service and entity with the given name')
  .helpOption('-h, --help', 'Display this help message')
  .addHelpText('after', '\nIf no option is provided, it will generate a module, controller and service with the given name.')
  .parse(process.argv);

const options = program.opts();

// Module generation code
if (options.module) {
  const name = options.module;
  Module.generate(nest, name);
}

// Controller generation code
if (options.controller) {
  const name = options.controller;
  Module.generate(nest, name);
  Controller.generate(nest, name);
  Controller.relocate(name);
  Module.updateControllerPath(name, `'./controller/${name}.controller';`);
}

// Service generation code
if (options.service) {
  const name = options.service;
  Module.generate(nest, name);
  Service.generate(nest, name);
  Service.relocate(name);
  Module.updateServicePath(name, `'./service/${name}.service';`);
}

// Entity generation code
if (options.entity) {
  const name = options.entity;
  Entity.generate(nest, name);
}

// All-in-one generation code here
if (options.all) {
  const name = options.all;
  Module.generate(nest, name);
  Controller.generate(nest, name);
  Controller.relocate(name);
  Module.updateControllerPath(name, `'./controller/${name}.controller';`);
  Service.generate(nest, name);
  Service.relocate(name);
  Module.updateServicePath(name, `'./service/${name}.service';`);
  Entity.generate(nest, name);
  Module.updateEntity(name);
}

// If no option is provided generates a module, service and controller with the given name.
if (!options.module && !options.controller && !options.service && !options.entity && !options.all) {
  const name = program.args[0];
  Module.generate(nest, name);
  Controller.generate(nest, name);
  Controller.relocate(name);
  Module.updateControllerPath(name, `'./controller/${name}.controller';`);
  Service.generate(nest, name);
  Service.relocate(name);
  Module.updateServicePath(name, `'./service/${name}.service';`);
}
