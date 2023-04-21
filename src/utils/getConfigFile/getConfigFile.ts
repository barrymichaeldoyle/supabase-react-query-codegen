import path from 'path';

import { Config } from '../../generate';

export function getConfigFile(configPath: string): Config {
  const absoluteConfigPath = path.resolve(process.cwd(), configPath);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const configFile = require(absoluteConfigPath);
    return configFile;
  } catch (error) {
    throw new Error(
      `Config file not found or could not be loaded at "${absoluteConfigPath}"`
    );
  }
}
