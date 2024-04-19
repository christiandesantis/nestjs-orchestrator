const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const Entity = {
  generate: function(name) {
    const entityName = name;
    const entityNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    // Generate entity file
    const entityDirPath = path.join('src', entityName);
    const entityFilePath = path.join(entityDirPath, `${entityName}.entity.ts`);
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
    // Create the directory if it does not exist
    if (!fs.existsSync(entityDirPath)) {
      fs.mkdirSync(entityDirPath, { recursive: true });
    }
    // Write entity file
    fs.writeFileSync(entityFilePath, entityFileContent);
  }
}

module.exports = Entity;
