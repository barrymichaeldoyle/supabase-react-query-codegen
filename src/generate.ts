// src/generate.ts

import { ModuleKind, ScriptTarget, Project } from 'ts-morph';
import fs from 'fs';

// Utility function to generate hook names
function toHookName(tableName: string, operation: string): string {
  return `use${tableName[0].toUpperCase() + tableName.slice(1)}${operation}`;
}

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

  const project = new Project({
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
    },
  });

  const sourceFile = project.addSourceFileAtPath(typesPath);

  // Find the 'Tables' type alias
  const databaseInterface = sourceFile.getInterfaceOrThrow('Database');
  const publicProperty = databaseInterface.getPropertyOrThrow('public');
  const publicType = publicProperty.getType();

  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  if (!tablesProperty) {
    throw new Error('No Tables property found within the Database interface.');
  }

  const tablesType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(tablesProperty.getValueDeclarationOrThrow());
  const tablesProperties = tablesType.getProperties();

  if (tablesProperties.length === 0) {
    throw new Error('No tables found within the Tables property.');
  }

  // Iterate through table keys and generate hooks
  const hooks: string[] = [];

  for (const table of tablesProperties) {
    const tableName = table.getName();

    // Generate hooks for fetching, adding, updating, and deleting
    hooks.push(
      `export function ${toHookName(tableName, 'ById')}(id: string) {
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
      `export function ${toHookName(tableName, 'FetchAll')}() {
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
