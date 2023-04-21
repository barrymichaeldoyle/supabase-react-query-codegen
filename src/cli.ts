#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

import generate, { Config } from './generate';

interface CliConfig extends Config {
  configPath?: string;
}

// Get the config file from the command line arguments
const getConfigFile = (configPath: string): Config => {
  if (fs.existsSync(configPath)) {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configFile);
  }
  throw new Error(`Config file not found at "${configPath}"`);
};

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
          outputPath: { type: 'string', demandOption: true },
          prettierConfigPath: { type: 'string' },
          relativeSupabasePath: { type: 'string' },
          supabaseExportName: { type: 'string' },
          typesPath: { type: 'string', demandOption: true },
        });
    },
    async (argv) => {
      const config: CliConfig = argv.configPath
        ? getConfigFile(argv.configPath)
        : argv;

      await generate(config);
    }
  )
  .help()
  .alias('help', 'h')
  .strict()
  .parse();
