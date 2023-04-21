import { format, resolveConfig } from 'prettier';

interface FormatContentArgs {
  generatedFileContent: string;
  prettierConfigPath?: string;
}

export async function formatGeneratedContent({
  generatedFileContent,
  prettierConfigPath = '.prettierrc',
}: FormatContentArgs): Promise<string> {
  const prettierConfig = await resolveConfig(prettierConfigPath);

  console.log('Prettier Config Path:', prettierConfigPath);
  console.log('Prettier Config:', prettierConfig);

  // Format the file content using Prettier
  const formattedFileContent = format(generatedFileContent, {
    parser: 'typescript',
    ...(prettierConfig || {}),
  });

  return formattedFileContent;
}
