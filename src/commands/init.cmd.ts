import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import ora from 'ora';

export const initCommand = new Command('init')
  .description('Initialize a new modular Express project')
  .argument('[projectName]', 'Name of the project')
  .action(async (projectName: string) => {
    console.log(chalk.blue('🚀 Welcome to the CODENUB Express Modular CLI!'));

    // Prompt for project name if not provided
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of your project?',
          default: 'my-express-app',
          validate: (input) => {
            if (/^([a-z0-9\-\_\.]+)$/.test(input)) return true;
            return 'Project name may only include letters, numbers, underscores, hashes, and dots.';
          }
        },
      ]);
      projectName = answers.name;
    }

    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
      console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
      process.exit(1);
    }

    // Confirm creation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Create a new project in ${chalk.cyan(projectPath)}?`,
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Operation cancelled.'));
      process.exit(0);
    }

    const spinner = ora('Initializing project structure...').start();

    try {
      // Create project directory
      await fs.ensureDir(projectPath);

      // Path to templates
      // In both src (dev) and dist (prod), templates are one level up from commands
      const templatePath = path.resolve(__dirname, '../templates/project');

      // Copy templates
      await fs.copy(templatePath, projectPath);

      // Update package.json with project name
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      // Update .gitignore (renaming .npmignore or creating new)
      const gitignoreContent = `
node_modules
dist
.env
.DS_Store
coverage
`;
      await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent.trim());

      spinner.succeed(chalk.green(`Project ${projectName} created successfully!`));

      console.log('\nNext steps:');
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan(`  npm install`));
      console.log(chalk.cyan(`  npm run dev`));

    } catch (error) {
      spinner.fail(chalk.red('Failed to create project.'));
      console.error(error);
      process.exit(1);
    }
  });
