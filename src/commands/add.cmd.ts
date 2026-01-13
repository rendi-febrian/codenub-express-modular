import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';

export const addCommand = new Command('add')
  .description('Add features to your project (docker, swagger)')
  .argument('<feature>', 'Feature to add (docker, swagger)')
  .action(async (feature: string) => {
    if (feature === 'docker') {
      await addDocker();
    } else if (feature === 'swagger') {
      await addSwagger();
    } else {
      console.error(chalk.red(`Feature ${feature} not supported. Try 'docker' or 'swagger'.`));
    }
  });



async function addDocker() {
  console.log(chalk.blue('Adding Docker support...'));

  const templatesDir = path.resolve(__dirname, '../templates/docker');
  const targetDir = process.cwd();

  // Prompt for Database Type
  const { dbType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'dbType',
      message: 'Select the database for Docker setup:',
      choices: [
        { name: 'PostgreSQL', value: 'postgres' },
        { name: 'MySQL', value: 'mysql' },
        { name: 'SQLite', value: 'sqlite' },
      ],
      default: 'postgres'
    }
  ]);

  const files = ['Dockerfile', '.dockerignore'];

  try {
    // 1. Copy Dockerfile & .dockerignore
    for (const file of files) {
      const content = await fs.readFile(path.join(templatesDir, file), 'utf-8');
      const targetPath = path.join(targetDir, file);

      if (fs.existsSync(targetPath)) {
        console.warn(chalk.yellow(`Skipped: ${file} already exists.`));
        continue;
      }

      await fs.writeFile(targetPath, content);
      console.log(chalk.green(`Created ${file}`));
    }

    // 2. Copy Specific Docker Compose
    const composeTemplate = `docker-compose.${dbType}.yml`;
    const composeTarget = 'docker-compose.yml';

    if (fs.existsSync(path.join(targetDir, composeTarget))) {
      console.warn(chalk.yellow(`Skipped: ${composeTarget} already exists.`));
    } else {
      const composeContent = await fs.readFile(path.join(templatesDir, composeTemplate), 'utf-8');
      await fs.writeFile(path.join(targetDir, composeTarget), composeContent);
      console.log(chalk.green(`Created ${composeTarget} (${dbType})`));
    }

    console.log(chalk.green('\nDocker support added successfully! 🐳'));
    console.log(chalk.white('Run: docker-compose up --build'));

  } catch (error) {
    console.error(chalk.red('Failed to add Docker support.'), error);
  }
}


async function addSwagger() {
  console.log(chalk.blue('Adding Swagger support...'));

  const targetDir = process.cwd();

  // 1. Install Dependencies
  console.log(chalk.yellow('Installing dependencies...'));

  // Use spawn to install
  const { spawn } = require('child_process');

  // Need to detect package manager (default to npm)
  const installCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  // Install runtime dependencies
  const installProcess = spawn(installCmd, ['install', 'swagger-ui-express', 'swagger-jsdoc', '--save'], { stdio: 'inherit', cwd: targetDir });

  await new Promise<void>((resolve, reject) => {
    installProcess.on('close', (code: number | null) => {
      if (code === 0) resolve();
      else reject(new Error('Failed to install dependencies'));
    });
  });

  // Install dev dependencies
  const installDevProcess = spawn(installCmd, ['install', '@types/swagger-ui-express', '@types/swagger-jsdoc', '--save-dev'], { stdio: 'inherit', cwd: targetDir });

  await new Promise<void>((resolve, reject) => {
    installDevProcess.on('close', (code: number | null) => {
      if (code === 0) resolve();
      else reject(new Error('Failed to install types'));
    });
  });

  // 2. Create Config File
  try {
    const configDir = path.join(targetDir, 'src/config');
    await fs.ensureDir(configDir);

    const tplPath = path.resolve(__dirname, '../templates/swagger/swagger.ts');
    const configContent = await fs.readFile(tplPath, 'utf-8');

    await fs.writeFile(path.join(configDir, 'swagger.ts'), configContent);
    console.log(chalk.green('Created src/config/swagger.ts'));

    // 3. Patch app.ts
    /* 
       This is tricky. We need to:
       - Add import { swaggerDocs } from './config/swagger';
       - Call swaggerDocs(this.app, this.port); inside listen() or constructor.
    */
    console.log(chalk.yellow('\nAction Required:'));
    console.log(chalk.white('Please manually manually import and call swaggerDocs in your src/app.ts:'));
    console.log(chalk.cyan(`
     import { swaggerDocs } from './config/swagger';
     
     // Inside listen() method:
     this.app.listen(this.port, () => {
         swaggerDocs(this.app, this.port); // <--- Add this
         // ...
     });
     `));

    console.log(chalk.green('\nSwagger support components added! 📄'));

  } catch (error) {
    console.error(chalk.red('Failed to configure Swagger.'), error);
  }
}
