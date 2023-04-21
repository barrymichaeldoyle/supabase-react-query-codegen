import path from 'path';
import { Config } from '../../generate';

const allowedExtensions = ['.js', '.json'];

export function getConfigFile(configPath: string): Config {
  const absoluteConfigPath = path.resolve(process.cwd(), configPath);
  const fileExtension = path.extname(absoluteConfigPath);

  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(
      `Invalid configuration file extension. Allowed extensions are: ${allowedExtensions.join(
        ', '
      )}`
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, security-node/detect-non-literal-require-calls
    const configFile = require(absoluteConfigPath);
    return configFile;
  } catch (error) {
    throw new Error(
      `Config file not found or could not be loaded at "${absoluteConfigPath}"`
    );
  }
}
