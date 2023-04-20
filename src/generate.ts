import fs from 'fs';

import { getTablesProperties } from './utils/getTablesProperties/getTablesProperties';
import { generateTypes } from './utils/generateTypes/generateTypes';
import { generateHooks } from './utils/generateHooks/generateHooks';
import { formatContent } from './utils/formatContent/formatContent';

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

    hooks.push(...generateHooks({ supabaseExportName, tableName }));
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

  const formattedFileContent = await formatContent({
    generatedFileContent,
    prettierConfigPath,
  });

  // Write the output file
  fs.writeFileSync(outputPath, formattedFileContent);
}
