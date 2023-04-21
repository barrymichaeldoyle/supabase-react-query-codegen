import fs from 'fs';
import path from 'path';

import { getTablesProperties } from './utils/getTablesProperties/getTablesProperties';
import { generateTypes } from './utils/generateTypes/generateTypes';
import { generateHooks } from './utils/generateHooks/generateHooks';
import { formatGeneratedContent } from './utils/formatGeneratedContent/formatGeneratedContent';
import { importSupabase } from './utils/importSupabase/importSupabase';

export interface Config {
  outputPath: string;
  prettierConfigPath?: string;
  relativeSupabasePath?: string;
  supabaseExportName?: string;
  typesPath: string;
}

export default async function generate({
  outputPath,
  prettierConfigPath,
  relativeSupabasePath,
  supabaseExportName,
  typesPath,
}: Config) {
  const allowedOutputDir = path.resolve(process.cwd());
  const resolvedOutputPath = path.resolve(allowedOutputDir, outputPath);
  if (!resolvedOutputPath.startsWith(allowedOutputDir)) {
    throw new Error(
      `Invalid output path: "${outputPath}". Writing files outside of the allowed directory is not allowed.`
    );
  }

  const tablesProperties = getTablesProperties(typesPath);

  // Iterate through table keys and generate hooks
  const hooks: string[] = [];
  const types: string[] = [];

  for (const table of tablesProperties) {
    const tableName = table.getName();

    hooks.push(...generateHooks({ supabaseExportName, tableName }));
    types.push(...generateTypes({ table, tableName }));
  }

  // Create the output file content with imports and hooks
  const generatedFileContent = `
import { useMutation, useQuery, useQueryClient } from 'react-query';
${importSupabase({ relativeSupabasePath, supabaseExportName })}

${types.join('\n')}

${hooks.join('\n\n')}
`;

  const formattedFileContent = await formatGeneratedContent({
    generatedFileContent,
    prettierConfigPath,
  });

  // Write the output file
  fs.writeFileSync(resolvedOutputPath, formattedFileContent);
}
