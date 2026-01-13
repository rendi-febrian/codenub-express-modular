import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

export const doctorCommand = new Command('doctor')
  .description('Check your project health and environment')
  .action(async () => {
    console.log(chalk.bold.blue('\n🩺 Checking system health...\n'));

    const checks = [
      checkNodeVersion,
      checkProjectStructure,
      checkDependencies
    ];

    let issues = 0;

    for (const check of checks) {
      try {
        const result = await check();
        if (!result.success) {
          console.log(chalk.yellow(`⚠ ${result.message}`));
          issues++;
        } else {
          console.log(chalk.green(`✔ ${result.message}`));
        }
      } catch (error: any) {
        console.log(chalk.red(`✖ Check failed: ${error.message}`));
        issues++;
      }
    }

    console.log('\n' + '-'.repeat(30) + '\n');
    if (issues === 0) {
      console.log(chalk.green('✨ Everything looks good! You are ready to code.'));
    } else {
      console.log(chalk.yellow(`Found ${issues} potential issues. Please review them.`));
    }
    console.log('');
  });

async function checkNodeVersion() {
  const version = process.version;
  return { success: true, message: `Node.js version: ${version}` };
}

async function checkProjectStructure() {
  const cwd = process.cwd();
  const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
  const hasTsConfig = fs.existsSync(path.join(cwd, 'tsconfig.json'));
  const hasSrc = fs.existsSync(path.join(cwd, 'src'));
  const hasEnv = fs.existsSync(path.join(cwd, '.env'));

  if (!hasPackageJson) return { success: false, message: 'package.json not found. Are you in the root of the project?' };
  if (!hasTsConfig) return { success: false, message: 'tsconfig.json not found.' };
  if (!hasSrc) return { success: false, message: 'src directory not found.' };

  if (!hasEnv) return { success: false, message: '.env file is missing (this is common for new clones, but ensure you have one).' };

  return { success: true, message: 'Project structure seems valid.' };
}

async function checkDependencies() {
  const cwd = process.cwd();
  try {
    const pkg = await fs.readJson(path.join(cwd, 'package.json'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const required = ['express', 'typescript', 'prisma'];
    const missing = required.filter(d => !deps[d] && !deps[`@types/${d}`]); // simple check

    if (missing.includes('prisma') && !deps['prisma']) {
      return { success: false, message: 'Prisma not found in dependencies. Run `cem prisma:init` to setup.' };
    }

    return { success: true, message: 'Key dependencies found.' };
  } catch (e) {
    return { success: false, message: 'Could not read package.json' };
  }
}
