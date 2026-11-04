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
  return useQuery<${getRowType}, Error>({
    queryKey: ['${tableName}', id],
    queryFn: async () => {
      const { data, error } = await ${supabase}
        .from('${tableName}')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as ${getRowType};
    },
    enabled: !!id,
  });
}`,
    `export function ${toHookName({ operation: 'GetAll', tableName })}() {
  return useQuery<${getRowType}[], Error>({
    queryKey: ['${tableName}'],
    queryFn: async () => {
      const { data, error } = await ${supabase}.from('${tableName}').select();
      if (error) throw error;
      return data as ${getRowType}[];
    },
  });
}`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, ${addRowType}>({
    mutationFn: async (item) => {
      const { error } = await ${supabase}.from('${tableName}').insert(item);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`,
    `export function ${toHookName({ operation: 'Update', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, ${updateRowType}>({
    mutationFn: async (item) => {
      const { error } = await ${supabase}
        .from('${tableName}')
        .update(item.changes)
        .eq('id', item.id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`,
    `export function ${toHookName({ operation: 'Delete', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, string>({
    mutationFn: async (id) => {
      const { error } = await ${supabase}
        .from('${tableName}')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${tableName}'] });
    },
  });
}`
  );

  return hooks;
}
