import { toTypeName } from '../generateTypes/toTypeName';
import { toHookName } from './toHookName';

interface GenerateHooksArg {
  tableName: string;
  supabaseExportName?: string | false;
}

export function generateHooks({
  supabaseExportName,
  tableName,
}: GenerateHooksArg): string[] {
  const hooks: string[] = [];
  const supabase = supabaseExportName || 'supabase';

  const getRowType = toTypeName({ operation: 'Get', tableName });
  const addRowType = toTypeName({ operation: 'Add', tableName });
  const updateRowType = toTypeName({ operation: 'Update', tableName });

  hooks.push(
    `export function ${toHookName({
      operation: 'Get',
      tableName,
    })}(id: string) {
  return useQuery<${getRowType}, Error>(
    ['${tableName}', id],
    async () => {
      const { data, error } = await ${supabase}
        .from('${tableName}')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data;
    },
    { enabled: !!id }
  );
}`,
    `export function ${toHookName({ operation: 'GetAll', tableName })}() {
  return useQuery<${getRowType}[], Error>(['${tableName}'], async () => {
    const { data, error } = await ${supabase}.from('${tableName}').select();
    if (error) throw error;
    return data as ${getRowType}[];
  });
}`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation(
    async (item: ${addRowType}Request) => {
      const { error } = await ${supabase}
        .from('${tableName}')
        .insert(item)
        .single();
      if (error) throw error;
      return null;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('${tableName}');
      },
    }
  );
}`,
    `export function ${toHookName({ operation: 'Update', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation(
    async (item: ${updateRowType}Request) => {
      const { error } = await ${supabase}
        .from('${tableName}')
        .update(item.changes)
        .eq('id', item.id)
        .single()
      if (error) throw error;
      return null;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('${tableName}');
      },
    }
  );
}`,
    `export function ${toHookName({ operation: 'Delete', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const { error} = await ${supabase}
        .from('${tableName}')
        .delete()
        .eq('id', id)
        .single()
      if (error) throw error;
      return null;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('${tableName}');
      }
    }
  );
}`
  );

  return hooks;
}
