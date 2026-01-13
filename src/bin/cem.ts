#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from '../commands/init.cmd';

import { createCommand } from '../commands/create.cmd';
import { prismaCommand } from '../commands/prisma.cmd';

const program = new Command();

const packageJson = require('../../package.json');

program
  .name('cem')
  .description('CODENUB Express Modular CLI')
  .version(packageJson.version);

import { listCommand } from '../commands/list.cmd';
import { removeCommand } from '../commands/remove.cmd';
import { doctorCommand } from '../commands/doctor.cmd';

// Register commands
program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(prismaCommand);
program.addCommand(listCommand);
program.addCommand(removeCommand);
program.addCommand(doctorCommand);

program.parse(process.argv);
