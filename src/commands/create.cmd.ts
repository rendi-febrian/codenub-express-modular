import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

export const createCommand = new Command('create')
  .description('Generate a new resource')
  .argument('<type>', 'Type of resource (module, service, repository)')
  .argument('<name>', 'Name of the resource')
  .action(async (type: string, name: string) => {
    if (type === 'module') {
      await generateModule(name);
    } else {
      console.log(chalk.red(`Type ${type} not supported yet. Try 'module'.`));
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

    const templatesDir = path.resolve(__dirname, '../../templates/module');

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
