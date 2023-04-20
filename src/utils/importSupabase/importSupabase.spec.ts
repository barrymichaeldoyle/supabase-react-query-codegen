import { importSupabase } from './importSupabase';

describe('importSupabase', () => {
  test('should return import statement with default export when supabaseExportName is not provided', () => {
    expect(importSupabase({ relativeSupabasePath: '../supabaseClient' })).toBe(
      "import supabase from '../supabaseClient';"
    );
  });

  test('should return import statement with named export when supabaseExportName is provided', () => {
    expect(
      importSupabase({
        relativeSupabasePath: '../supabaseClient',
        supabaseExportName: 'customSupabase',
      })
    ).toBe("import { customSupabase } from '../supabaseClient';");
  });

  test('should throw an error when relativeSupabasePath is not provided', () => {
    expect(importSupabase({})).toBe("import supabase from './supabase';");
  });
});
