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

  const getRowType = toTypeName(tableName, 'Get');
  const addRowType = toTypeName(tableName, 'Add');
  const updateRowType = toTypeName(tableName, 'Update');

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
      return useQuery<${getRowType}[], Error>(['${tableName}'], async () => {
        const { data, error } = await ${supabase}.from('${tableName}').select();
        if (error) throw error;
        return data as ${getRowType}[];
      });
    }`,
    `export function ${toHookName({ operation: 'Add', tableName })}() {
      const queryClient = useQueryClient();
      return useMutation((item: ${addRowType}Request) => {
        return new Promise<null>((resolve, reject) => {
          ${supabase}
            .from('${tableName}')
            .insert(item)
            .single()
            .then(({ error }) => {
              if (error) {
                reject(error);
              }
              resolve(null);
            });
        });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('${tableName}');
        },
      });
    }`,
    `export function ${toHookName({ operation: 'Update', tableName })}() {
      const queryClient = useQueryClient();
      return useMutation((item: ${updateRowType}Request) => {
        return new Promise<null>((resolve, reject) => {
          ${supabase}
            .from('${tableName}')
            .update(item.changes)
            .eq('id', item.id)
            .single()
            .then(({ error }) => {
              if (error) {
                reject(error);
              }
              resolve(null);
            });
        });
      },
      {
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
