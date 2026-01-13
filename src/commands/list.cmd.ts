import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

export const listCommand = new Command('list')
  .description('List all modules in the project')
  .argument('[type]', 'Type of resource to list (default: modules)')
  .action(async (type: string = 'modules') => {
    if (type !== 'modules') {
      console.log(chalk.yellow(`Currently only listing 'modules' is supported.`));
      return;
    }

    const modulesPath = path.join(process.cwd(), 'src/modules');

    if (!fs.existsSync(modulesPath)) {
      console.log(chalk.red('src/modules directory not found.'));
      return;
    }

    const modules = fs.readdirSync(modulesPath).filter(f => fs.statSync(path.join(modulesPath, f)).isDirectory());

    if (modules.length === 0) {
      console.log(chalk.yellow('No modules found.'));
      return;
    }

    console.log(chalk.bold.cyan('\n📦 Modules Structure:\n'));

    for (const moduleName of modules) {
      console.log(chalk.blue(`├── 📂 ${moduleName}`));
      const moduleDir = path.join(modulesPath, moduleName);
      const files = fs.readdirSync(moduleDir).filter(f => fs.statSync(path.join(moduleDir, f)).isFile());

      for (const file of files) {
        let icon = '📄';
        if (file.includes('controller')) icon = '🎮';
        if (file.includes('service')) icon = '⚙️ ';
        if (file.includes('repository')) icon = '🗄️ ';
        if (file.includes('dto')) icon = '📨';

        console.log(`│   ├── ${icon} ${file}`);
      }
      console.log(`│`);
    }
    console.log(chalk.gray(`Found ${modules.length} modules.\n`));
  });
