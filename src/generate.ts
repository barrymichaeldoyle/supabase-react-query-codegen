// src/generate.ts

import fs from 'fs';
import prettier, { resolveConfig } from 'prettier';
import { getTablesProperties } from './utils/getTablesProperties';
import { generateTypes } from './utils/generateTypes/generateTypes';
import { generateHooks } from './utils/generateHooks/generateHooks';
import { toTypeName } from './utils/generateTypes/toTypeName';

export interface Config {
  outputPath: string;
  prettierConfigPath: string;
  relativeSupabasePath: string;
  supabaseExportName?: string | false;
  typesPath: string;
}

export default async function generate({
  outputPath,
  prettierConfigPath = '.prettierrc',
  relativeSupabasePath,
  supabaseExportName = 'supabase',
  typesPath,
}: Config) {
  console.log('Generating hooks with the following arguments:', {
    outputPath,
    prettierConfigPath,
    relativeSupabasePath,
    supabaseExportName,
    typesPath,
  });

  const tablesProperties = getTablesProperties(typesPath);

  // Iterate through table keys and generate hooks
  const hooks: string[] = [];
  const types: string[] = [];

  for (const table of tablesProperties) {
    const tableName = table.getName();

    hooks.push(
      ...generateHooks({
        supabaseExportName,
        tableName,
        rowType: toTypeName(tableName, 'Get') + 'Response',
      })
    );
    types.push(...generateTypes({ table, tableName }));
  }

  // Create the output file content with imports and hooks
  const generatedFileContent = `
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ${
    supabaseExportName ? `{ ${supabaseExportName} }` : 'supabase'
  } from '${relativeSupabasePath}';

${types.join('\n')}

${hooks.join('\n\n')}
`;

  const prettierConfig = prettierConfigPath
    ? await resolveConfig(prettierConfigPath)
    : undefined;

  // Format the file content using Prettier
  const formattedFileContent = prettier.format(generatedFileContent, {
    parser: 'typescript',
    // Additional Prettier options can be added here
    ...(prettierConfig || {}),
  });

  // Write the output file
  fs.writeFileSync(outputPath, formattedFileContent);
}
