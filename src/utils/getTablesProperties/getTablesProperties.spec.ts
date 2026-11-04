import path from 'path';

import { getTablesProperties } from './getTablesProperties';

const fixture = (name: string) => path.join(__dirname, 'fixtures', name);

describe('getTablesProperties', () => {
  it('reads tables from a `type Database` alias (current Supabase CLI output)', () => {
    const tables = getTablesProperties(fixture('type-alias.types.ts'));
    expect(tables.map((table) => table.getName())).toEqual([
      'todo_items',
      'profiles',
    ]);
  });

  it('reads tables from an `interface Database` (older Supabase CLI output)', () => {
    const tables = getTablesProperties(fixture('interface.types.ts'));
    expect(tables.map((table) => table.getName())).toEqual([
      'todo_items',
      'profiles',
    ]);
  });
});
