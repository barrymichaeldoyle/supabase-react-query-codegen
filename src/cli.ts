#!/usr/bin/env node

import yargs from 'yargs';
import generateHooks from './generate';

console.log('CLI script started');

yargs(process.argv.slice(2))
  .command({
    command: 'generate [typesPath] [outputPath] [supabaseClientPath]',
    aliases: ['g'],
    describe: 'Generate React Query hooks from a types file',
    builder: (yargs) => {
      return yargs
        .positional('typesPath', {
          describe: 'Path to the types file',
          type: 'string',
        })
        .positional('outputPath', {
          describe: 'Path to the output hooks file',
          type: 'string',
        })
        .positional('supabaseClientPath', {
          describe: 'Path to the Supabase client file',
          type: 'string',
        });
    },
    handler: (argv) => {
      console.log('Inside generate command handler');
      generateHooks(
        argv.typesPath as string,
        argv.outputPath as string,
        argv.supabaseClientPath as string
      );
      console.log('generateHooks function has been called');
    },
  })
  .demandCommand(1, 'You need at least one command')
  .strict()
  .help()
  .wrap(72)
  .parse();

console.log('CLI script finished');
