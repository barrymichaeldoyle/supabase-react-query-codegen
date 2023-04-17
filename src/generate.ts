// src/generate.ts

import { ModuleKind, ScriptTarget, Project } from 'ts-morph';
import fs from 'fs';
import { toHookName } from './utils/toHookName';
import { getTablesProperties } from './utils/getTablesProperties';

// Utility function to generate hook names

export default function generateHooks(
  typesPath: string,
  outputPath: string,
  supabaseClientPath: string,
) {
  console.log('Generating hooks with the following arguments:', {
    typesPath,
    outputPath,
    supabaseClientPath,
  });

  const tablesProperties = getTablesProperties(typesPath);

  // Iterate through table keys and generate hooks
  const hooks: string[] = [];

  for (const table of tablesProperties) {
    const tableName = table.getName();

    // Generate hooks for fetching, adding, updating, and deleting
    hooks.push(
      `export function ${toHookName(tableName, 'Get')}(id: string) {
    return useQuery<Database['public']['Tables']['${tableName}']['Row'], Error>(
      ['${tableName}', id],
      async () => {
        const { data, error } = await supabase
          .from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No data found');
        }

        return data;
      },
      {
        enabled: !!id,
      }
    );
  }`,
      `export function ${toHookName(tableName, 'GetAll')}() {
    return useQuery<Database['public']['Tables']['${tableName}']['Row'][], Error>(['${tableName}'], async () => {
      const { data, error } = await supabase.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').select();
      if (error) throw error;
      return data as Database['public']['Tables']['${tableName}']['Row'][];
    });
  }`,
      `export function ${toHookName(tableName, 'Add')}() {
    const queryClient = useQueryClient();
    return useMutation((item: Database['public']['Tables']['${tableName}']['Insert']) => supabase.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').insert(item).single(), {
      onSuccess: () => {
        queryClient.invalidateQueries('${tableName}');
      },
    });
  }`,
      `export function ${toHookName(tableName, 'Update')}() {
    const queryClient = useQueryClient();
    return useMutation((item: { id: string; changes: Database['public']['Tables']['${tableName}']['Update'] }) => supabase.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').update(item.changes).eq('id', item.id).single(), {
      onSuccess: () => {
        queryClient.invalidateQueries('${tableName}');
      },
    });
  }`,
      `export function ${toHookName(tableName, 'Delete')}() {
    const queryClient = useQueryClient();
    return useMutation((id: string) => supabase.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').delete().eq('id', id).single(), {
      onSuccess: () => {
        queryClient.invalidateQueries('${tableName}');
      },
    });
  }`,
    );
  }

  // Create the output file content with imports and hooks
  const hooksFileContent = `
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Database } from '${typesPath}';
import { supabase } from '${supabaseClientPath}';

${hooks.join('\n\n')}
`;

  // Write the output file
  fs.writeFileSync(outputPath, hooksFileContent);
}
