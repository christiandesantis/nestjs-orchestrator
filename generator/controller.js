const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const Controller = {
  generate: function(nest, name) {
    // Execute the command to generate the controller
    execSync(`${nest} g controller ${name}`, { stdio: 'inherit' });
  },
  relocate: function(name) {
    // Create the controller directory
    fs.mkdirSync(path.join('src', name, 'controller'), { recursive: true });

    // Move the controller and controller.spec files to their respective directory
    fs.renameSync(
      path.join('src', name, `${name}.controller.ts`),
      path.join('src', name, 'controller', `${name}.controller.ts`)
    );
    fs.renameSync(
      path.join('src', name, `${name}.controller.spec.ts`),
      path.join('src', name, 'controller', `${name}.controller.spec.ts`)
    );
  }
}

module.exports = Controller;
