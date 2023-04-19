import { toHookName } from './toHookName';

interface GenerateHooksArg {
  tableName: string;
  rowType: string;
  supabaseExportName?: string | false;
}

export function generateHooks({
  supabaseExportName,
  tableName,
  rowType,
}: GenerateHooksArg): string[] {
  const hooks: string[] = [];
  const supabase = supabaseExportName || 'supabase';

  hooks.push(
    `export function ${toHookName({
      operation: 'Get',
      tableName,
    })}(id: string) {
      return useQuery<${rowType}, Error>(
        ['${tableName}', id],
        async () => {
          const { data, error } = await ${supabase}
            .from('${tableName}')
            .select('*')
            .eq('id', id)
            .single();
    
          if (error) {
            throw error;
          }
    
          if (!data) {
            throw new Error('No data found');
          }
    
          return data as ${rowType};
        },
        {
          enabled: !!id,
        }
      );
    }`,
    `export function ${toHookName({ operation: 'GetAll', tableName })}() {
      return useQuery<${rowType}[], Error>(['${tableName}'], async () => {
        const { data, error } = await ${supabase}.from('${tableName}').select();
        if (error) throw error;
        return data as ${rowType}[];
      });
    }`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
      const queryClient = useQueryClient();
      return useMutation((item: ${rowType}) => ${supabase}.from('${tableName}').insert(item).single(), {
        onSuccess: () => {
          queryClient.invalidateQueries('${tableName}');
        },
      });
    }`,
    `export function ${toHookName({ operation: 'Update', tableName })}() {
      const queryClient = useQueryClient();
      return useMutation((item: { id: string; changes: ${rowType} }) => ${supabase}.from('${tableName}').update(item.changes).eq('id', item.id).single(), {
        onSuccess: () => {
          queryClient.invalidateQueries('${tableName}');
        },
      });
    }`,
    `export function ${toHookName({ operation: 'Delete', tableName })}() {
      const queryClient = useQueryClient();
      return useMutation((id: string) => ${supabase}.from('${tableName}').delete().eq('id', id).single(), {
        onSuccess: () => {
          queryClient.invalidateQueries('${tableName}');
        },
      });
    }`
  );

  return hooks;
}
