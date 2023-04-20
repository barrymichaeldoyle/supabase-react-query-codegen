interface ImportSupabaseArgs {
  relativeSupabasePath?: string;
  supabaseExportName?: string;
}

export function importSupabase({
  relativeSupabasePath = './supabase',
  supabaseExportName,
}: ImportSupabaseArgs): string {
  const exportName = supabaseExportName
    ? `{ ${supabaseExportName} }`
    : 'supabase';

  return `import ${exportName} from '${relativeSupabasePath}';`;
}
