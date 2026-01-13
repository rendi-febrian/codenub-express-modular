#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from '../commands/init.cmd';

import { createCommand } from '../commands/create.cmd';
import { prismaCommand } from '../commands/prisma.cmd';

const program = new Command();

program
  .name('cem')
  .description('CODENUB Express Modular CLI')
  .version('1.0.0');

// Register commands
program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(prismaCommand);

program.parse(process.argv);
