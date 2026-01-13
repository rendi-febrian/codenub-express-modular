import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

export const prismaCommand = new Command('prisma')
  .description('Prisma ORM integration')

prismaCommand
  .command('init')
  .description('Setup Prisma in the project')
  .action(async () => {
    console.log(chalk.blue('Setting up Prisma...'));
    try {
      console.log(chalk.yellow('Installing dependencies...'));
      execSync('npm install -D prisma', { stdio: 'inherit' });
      execSync('npm install @prisma/client', { stdio: 'inherit' });

      console.log(chalk.yellow('Initializing Prisma...'));
      execSync('npx prisma init', { stdio: 'inherit' });

      console.log(chalk.green('Prisma initialized successfully!'));
    } catch (error) {
      console.error(chalk.red('Failed to setup Prisma.'), error);
    }
  });

prismaCommand
  .command('generate')
  .description('Generate Prisma Client and Repositories')
  .action(async () => {
    try {
      console.log(chalk.blue('Generating Prisma Client...'));
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log(chalk.green('Prisma Client generated!'));

      // TODO: Logic to parse schema and generate repositories
      // readSchemaAndGenerateRepos();

    } catch (error) {
      console.error(chalk.red('Failed to generate.'), error);
    }
  });
