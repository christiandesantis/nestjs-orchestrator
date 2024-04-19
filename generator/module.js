const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const Module = {
  generate: function(nest, name) {
    // Execute the command to generate the module
    execSync(`${nest} g module ${name}`, { stdio: 'inherit' });
  },
  format: function(name) {
    // Get the module file path
    const moduleFilePath = path.join('src', name, `${name}.module.ts`);
    // Read the module file content
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
    // Add a comma after the providers array
    moduleFileContent = moduleFileContent.replace(/(providers: \[[^\]]*\])/g, `$1,`);
    // Save the updated module file
    fs.writeFileSync(moduleFilePath, moduleFileContent);
  },
  updateServicePath: function(name, newPath = `'./service/${name}.service';`) {
    // Get the module file path
    const moduleFilePath = path.join('src', name, `${name}.module.ts`);
    // Read the module file content
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
    // Update the service import path
    moduleFileContent = moduleFileContent.replace(
      `'./${name}.service';`,
      newPath || `'./service/${name}.service';`
    );
    // Save the updated module file
    fs.writeFileSync(moduleFilePath, moduleFileContent);
  },
  updateControllerPath: function(name, newPath = `'./controller/${name}.controller';`) {
    // Get the module file path
    const moduleFilePath = path.join('src', name, `${name}.module.ts`);
    // Read the module file content
    let moduleFileContent = fs.readFileSync(moduleFilePath, 'utf8');
    // Update the controller import path
    moduleFileContent = moduleFileContent.replace(
      `'./${name}.controller';`,
      newPath || `'./controller/${name}.controller';`
    );
    // Save the updated module file
    fs.writeFileSync(moduleFilePath, moduleFileContent);
  },
  updateEntity: function(name) {
    const entityName = name;
    const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  
    // Get the module file path
    const moduleFilePath = path.join('src', name, `${name}.module.ts`);
    // Read the module file content
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
}

module.exports = Module;
