#!/usr/bin/env node

import yargs from 'yargs';
import generateHooks from './generate';

// Define the command line interface
yargs(process.argv.slice(2))
  .command(
    'generate [typesPath] [outputPath] [supabaseClientPath]',
    'Generate React Query hooks from a types file',
    (yargs) => {
      yargs
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
    (argv) => {
      try {
        // Call the generateHooks function with the provided arguments
        generateHooks(
          argv.typesPath as string,
          argv.outputPath as string,
          argv.supabaseClientPath as string,
        );
        console.log('Hooks generated successfully!');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error generating hooks:', error.message);
        } else {
          console.error('Error generating hooks:', error);
        }
        process.exit(1);
      }
    },
  )
  .demandCommand(1, 'You need at least one command')
  .strict()
  .help()
  .wrap(72);
