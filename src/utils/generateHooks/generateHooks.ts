import { toHookName } from './toHookName';

interface GenerateHooksArgs {
  tableName: string;
  supabaseExportName?: string | false;
}

export function generateHooks({
  tableName,
  supabaseExportName,
}: GenerateHooksArgs): string[] {
  const hooks: string[] = [];
  const supabase = supabaseExportName || 'supabase';

  hooks.push(
    `export function ${toHookName({
      operation: 'Get',
      tableName,
    })}(id: string) {
  return useQuery<Database['public']['Tables']['${tableName}']['Row'], Error>(
    ['${tableName}', id],
    async () => {
      const { data, error } = await ${supabase}
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
    `export function ${toHookName({ operation: 'GetAll', tableName })}() {
  return useQuery<Database['public']['Tables']['${tableName}']['Row'][], Error>(['${tableName}'], async () => {
    const { data, error } = await ${supabase}.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').select();
    if (error) throw error;
    return data as Database['public']['Tables']['${tableName}']['Row'][];
  });
}`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation((item: Database['public']['Tables']['${tableName}']['Insert']) => ${supabase}.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').insert(item).single(), {
    onSuccess: () => {
      queryClient.invalidateQueries('${tableName}');
    },
  });
}`,
    `export function ${toHookName({ operation: 'Update', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation((item: { id: string; changes: Database['public']['Tables']['${tableName}']['Update'] }) => ${supabase}.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').update(item.changes).eq('id', item.id).single(), {
    onSuccess: () => {
      queryClient.invalidateQueries('${tableName}');
    },
  });
}`,
    `export function ${toHookName({ operation: 'Delete', tableName })}() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => ${supabase}.from<Database['public']['Tables']['${tableName}']['Row']>('${tableName}').delete().eq('id', id).single(), {
    onSuccess: () => {
      queryClient.invalidateQueries('${tableName}');
    },
  });
}`
  );

  return hooks;
}
