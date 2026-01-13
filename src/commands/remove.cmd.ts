import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';

export const removeCommand = new Command('remove')
  .description('Remove a module')
  .argument('<type>', 'Type of resource (module)')
  .argument('<name>', 'Name of the resource')
  .action(async (type: string, name: string) => {
    if (type !== 'module') {
      console.log(chalk.red(`Only 'module' removal is supported currently.`));
      return;
    }

    const kebabName = name.toLowerCase(); // Simple normalization
    const targetDir = path.join(process.cwd(), 'src/modules', kebabName);

    if (!fs.existsSync(targetDir)) {
      console.error(chalk.red(`Module '${name}' not found at ${targetDir}`));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow(`Are you sure you want to PERMANENTLY delete module '${name}'? This cannot be undone.`),
        default: false
      }
    ]);

    if (confirm) {
      try {
        await fs.remove(targetDir);
        console.log(chalk.green(`✔ Module '${name}' deleted successfully.`));
      } catch (error) {
        console.error(chalk.red(`Failed to delete module '${name}'.`), error);
      }
    } else {
      console.log(chalk.blue('Deletion cancelled.'));
    }
  });
