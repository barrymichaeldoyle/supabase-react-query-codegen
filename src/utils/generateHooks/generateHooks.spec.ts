import { generateHooks } from './generateHooks';

describe('generateHooks', () => {
  const hooks = generateHooks({ tableName: 'todo_items' }).join('\n');

  it('uses the TanStack Query object syntax', () => {
    expect(hooks).toContain("queryKey: ['todo_items', id]");
    expect(hooks).toContain('mutationFn: async (item) =>');
    expect(hooks).toContain(
      "queryClient.invalidateQueries({ queryKey: ['todo_items'] })"
    );
  });

  it('defaults the client name to supabase', () => {
    expect(hooks).toContain("await supabase.from('todo_items')");
  });

  it('uses a custom client export name', () => {
    const custom = generateHooks({
      tableName: 'todo_items',
      supabaseExportName: 'db',
    }).join('\n');
    expect(custom).toContain("await db.from('todo_items')");
  });
});
