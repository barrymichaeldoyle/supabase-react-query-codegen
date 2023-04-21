#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import generate, { Config } from './generate';

interface CliConfig extends Config {
  configPath?: string;
}

// Get the config file from the command line arguments
function getConfigFile(configPath: string): Config {
  const absoluteConfigPath = path.resolve(process.cwd(), configPath);
  try {
    const configFile = require(absoluteConfigPath);
    return configFile;
  } catch (error) {
    throw new Error(
      `Config file not found or could not be loaded at "${absoluteConfigPath}"`
    );
  }
}

yargs(hideBin(process.argv))
  .command(
    'generate [configPath]',
    'Generate hooks',
    (yargs) => {
      return yargs
        .positional('configPath', {
          describe: 'Path to the configuration file',
          type: 'string',
        })
        .options({
          outputPath: { type: 'string' },
          prettierConfigPath: { type: 'string' },
          relativeSupabasePath: { type: 'string' },
          supabaseExportName: { type: 'string' },
          typesPath: { type: 'string' },
        })
        .check((argv) => {
          if (!argv.configPath && (!argv.outputPath || !argv.typesPath)) {
            throw new Error(
              'When "configPath" is not provided, both "outputPath" and "typesPath" must be provided.'
            );
          }
          return true;
        });
    },
    async (argv) => {
      const config: CliConfig = argv.configPath
        ? getConfigFile(argv.configPath)
        : (argv as CliConfig);

      await generate(config);
    }
  )
  .help()
  .alias('help', 'h')
  .strict()
  .parse();
