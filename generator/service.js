const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const Service = {
  generate: function(nest, name) {
    // Execute the command to generate the service
    execSync(`${nest} g service ${name}`, { stdio: 'inherit' });
  },
  relocate: function(name) {
    // Create the service directory
    fs.mkdirSync(path.join('src', name, 'service'), { recursive: true });

    // Move the service and service.spec files to their respective directory
    fs.renameSync(
      path.join('src', name, `${name}.service.ts`),
      path.join('src', name, 'service', `${name}.service.ts`)
    );
    fs.renameSync(
      path.join('src', name, `${name}.service.spec.ts`),
      path.join('src', name, 'service', `${name}.service.spec.ts`)
    );
  }
}

module.exports = Service;
