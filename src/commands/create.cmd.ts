import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';

export const createCommand = new Command('create')
  .description('Generate a new resource')
  .argument('<type>', 'Type of resource (module, service, repository)')
  .argument('<name>', 'Name of the resource')
  .action(async (type: string, name: string) => {
    if (type === 'module') {
      await generateModule(name);
    } else if (type === 'service') {
      await generateComponent(name, 'service');
    } else if (type === 'repository') {
      await generateComponent(name, 'repository');
    } else {
      console.log(chalk.red(`Type ${type} not supported. Try 'module', 'service', or 'repository'.`));
    }
  });

async function generateModule(name: string) {
  const kebabName = toKebabCase(name);
  const pascalName = toPascalCase(name);

  const targetDir = path.join(process.cwd(), 'src/modules', kebabName);

  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`Module ${name} already exists.`));
    return;
  }

  console.log(chalk.blue(`Generating module ${name}...`));

  try {
    await fs.ensureDir(targetDir);
    await fs.ensureDir(path.join(targetDir, 'dto'));

    let templatesDir = path.resolve(__dirname, '../templates/module');

    // Check for standard modules
    if (kebabName === 'user' || kebabName === 'users') {
      const { useStandard } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useStandard',
          message: 'Detected "user" module. Do you want to use the Standard User Template (with email/password fields)?',
          default: true
        }
      ]);
      if (useStandard) {
        templatesDir = path.resolve(__dirname, '../templates/module-user');
      }
    } else if (kebabName === 'auth') {
      const { useStandard } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useStandard',
          message: 'Detected "auth" module. Do you want to use the Standard Auth Template (Login/Register)?',
          default: true
        }
      ]);
      if (useStandard) {
        templatesDir = path.resolve(__dirname, '../templates/module-auth');
      }
    }

    // Files to generate
    const files = [
      { tpl: 'controller.tpl', out: `${kebabName}.controller.ts` },
      { tpl: 'service.tpl', out: `${kebabName}.service.ts` },
      { tpl: 'repository.tpl', out: `${kebabName}.repository.ts` },
      { tpl: 'dto.tpl', out: `dto/${kebabName}.dto.ts` },
    ];

    for (const file of files) {
      const tplContent = await fs.readFile(path.join(templatesDir, file.tpl), 'utf-8');
      const content = tplContent
        .replace(/{{PascalName}}/g, pascalName)
        .replace(/{{kebabName}}/g, kebabName);

      await fs.writeFile(path.join(targetDir, file.out), content);
      console.log(chalk.green(`  Created ${file.out}`));
    }

    console.log(chalk.green(`\nModule ${name} created successfully!`));

  } catch (error) {
    console.error(chalk.red('Failed to generate module.'), error);
  }
}

async function generateComponent(name: string, type: 'service' | 'repository') {
  const kebabName = toKebabCase(name);
  const pascalName = toPascalCase(name);

  // Find available modules
  const modulesPath = path.join(process.cwd(), 'src/modules');
  if (!fs.existsSync(modulesPath)) {
    console.error(chalk.red('Error: src/modules directory not found. Are you in the root of the project?'));
    return;
  }

  const modules = fs.readdirSync(modulesPath).filter(f => fs.statSync(path.join(modulesPath, f)).isDirectory());

  if (modules.length === 0) {
    console.error(chalk.red('No modules found. Create a module first using `cem create module <name>`.'));
    return;
  }

  // Ask user to select module
  const { selectedModule } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedModule',
      message: `Which module does this ${type} belong to?`,
      choices: modules
    }
  ]);

  const targetDir = path.join(modulesPath, selectedModule);
  if (!fs.existsSync(targetDir)) { // Double check
    console.error(chalk.red(`Module ${selectedModule} not found.`));
    return;
  }

  const templatesDir = path.resolve(__dirname, '../templates/module');
  const tplFile = `${type}.tpl`;
  const outFile = `${kebabName}.${type}.ts`;

  try {
    const tplContent = await fs.readFile(path.join(templatesDir, tplFile), 'utf-8');
    const content = tplContent
      .replace(/{{PascalName}}/g, pascalName)
      .replace(/{{kebabName}}/g, kebabName);

    const outPath = path.join(targetDir, outFile);
    if (fs.existsSync(outPath)) {
      console.error(chalk.red(`Error: ${outFile} already exists in module ${selectedModule}.`));
      return;
    }

    await fs.writeFile(outPath, content);
    console.log(chalk.green(`Successfully created ${outFile} in module ${selectedModule}`));

  } catch (error) {
    console.error(chalk.red(`Failed to generate ${type}.`), error);
  }
}

function toKebabCase(str: string): string {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('-') || str;
}

function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/[\s-_]+/g, '');
}
