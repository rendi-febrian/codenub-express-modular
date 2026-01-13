import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';

export const createCommand = new Command('create')
  .description('Generate a new resource')
  .argument('[type]', 'Type of resource (module, service, repository)')
  .argument('[name]', 'Name of the resource')
  .option('-p, --path <path>', 'Custom path for generation')
  .action(async (typeStr: string | undefined, nameStr: string | undefined, options: { path?: string }) => {
    const VALID_TYPES = ['module', 'service', 'repository'];
    let type = typeStr;
    let name = nameStr;

    // Smart detection: If type provided is NOT in valid list, assume it is the name
    if (type && !VALID_TYPES.includes(type)) {
      name = type;
      type = undefined; // Reset type to force prompt
    }

    if (!type) {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: name
            ? `What do you want to create named "${name}"?`
            : 'What do you want to create?',
          choices: VALID_TYPES
        }
      ]);
      type = answer.type;
    }

    if (!name) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `What is the name of the ${type}?`,
          validate: (input) => input ? true : 'Name cannot be empty'
        }
      ]);
      name = answer.name;
    }

    // Safety check
    if (!type || !name) return;

    if (type === 'module') {
      await generateModule(name, options.path);
    } else if (type === 'service') {
      await generateComponent(name, 'service', options.path);
    } else if (type === 'repository') {
      await generateComponent(name, 'repository', options.path);
    } else {
      console.log(chalk.red(`Type ${type} not supported. Try 'module', 'service', or 'repository'.`));
    }
  });

async function generateModule(name: string, customPath?: string) {
  const kebabName = toKebabCase(name);
  const pascalName = toPascalCase(name);

  // If custom path is provided, use it directly. Otherwise use src/modules
  const baseDir = customPath
    ? path.resolve(process.cwd(), customPath)
    : path.join(process.cwd(), 'src/modules');

  const targetDir = customPath ? baseDir : path.join(baseDir, kebabName);

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

async function generateComponent(name: string, type: 'service' | 'repository', customPath?: string) {
  let targetDir = '';
  // Default component name is the full name provided
  let componentName = name;

  // Check if name contains path separators (e.g. Services/AwsHelper)
  if (name.includes('/') || name.includes('\\')) {
    const normalized = name.split(path.sep).join('/');
    const parts = normalized.split('/');

    componentName = parts.pop() || name; // Last part is the component name (e.g. AwsHelper)
    const dirPath = parts.join('/'); // The rest is the directory path (e.g. Services)

    // Target is src + specified path (Case Sensitive folder name)
    targetDir = path.join(process.cwd(), 'src', dirPath);
    await fs.ensureDir(targetDir);
  } else if (customPath) {
    targetDir = path.resolve(process.cwd(), customPath);
    await fs.ensureDir(targetDir);
  } else {
    // Find available modules
    const modulesPath = path.join(process.cwd(), 'src/modules');
    if (!fs.existsSync(modulesPath)) {
      console.error(chalk.red('Error: src/modules directory not found. Are you in the root of the project?'));
      return;
    }

    const modules = fs.readdirSync(modulesPath).filter(f => fs.statSync(path.join(modulesPath, f)).isDirectory());

    const GLOBAL_OPTION = 'Global / Shared (src/common/services)';
    const choices = [GLOBAL_OPTION, ...modules];

    // Ask user to select module
    const { selectedModule } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedModule',
        message: `Where should this ${type} belong?`,
        choices: choices
      }
    ]);

    if (selectedModule === GLOBAL_OPTION) {
      targetDir = path.join(process.cwd(), 'src/common/services');
      if (type === 'repository') targetDir = path.join(process.cwd(), 'src/common/repositories');
      await fs.ensureDir(targetDir);
    } else {
      targetDir = path.join(modulesPath, selectedModule);
      if (!fs.existsSync(targetDir)) {
        console.error(chalk.red(`Module ${selectedModule} not found.`));
        return;
      }
    }
  }

  const kebabName = toKebabCase(componentName);
  const pascalName = toPascalCase(componentName);

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
      console.error(chalk.red(`Error: ${outFile} already exists at ${outPath}.`));
      return;
    }

    await fs.writeFile(outPath, content);
    console.log(chalk.green(`Successfully created ${outFile}`));
    console.log(chalk.gray(`Path: ${outPath}`));

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
