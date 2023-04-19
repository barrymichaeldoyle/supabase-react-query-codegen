import { toHookName } from './toHookName';

describe('toHookName', () => {
  it('should return the hook name for a table with a single word name.', () => {
    const hookName = toHookName({ tableName: 'users', operation: 'Get' });
    expect(hookName).toBe('useGetUser');
  });

  it('should return the hook name for a table with a single word name and the GetAll operation', () => {
    const hookName = toHookName({ tableName: 'users', operation: 'GetAll' });
    expect(hookName).toBe('useGetAllUsers');
  });

  it('should return the hook name for a table with a snake_case name and a non-GetAll operation', () => {
    const hookName = toHookName({
      tableName: 'todo_items',
      operation: 'Update',
    });
    expect(hookName).toBe('useUpdateTodoItem');
  });

  it('should return the hook name for a table with a snake_case name and the GetAll operation', () => {
    const hookName = toHookName({
      tableName: 'todo_items',
      operation: 'GetAll',
    });
    expect(hookName).toBe('useGetAllTodoItems');
  });

  it('should return the hook name for a table with a multi-word snake_case name and a non-GetAll operation', () => {
    const hookName = toHookName({
      tableName: 'order_item_details',
      operation: 'Delete',
    });
    expect(hookName).toBe('useDeleteOrderItemDetail');
  });

  it('should return the hook name for a table with a multi-word snake_case name and the GetAll operation', () => {
    const hookName = toHookName({
      tableName: 'order_item_details',
      operation: 'GetAll',
    });
    expect(hookName).toBe('useGetAllOrderItemDetails');
  });

  it('should return the hook name for a table named people and a non-GetAll operation', () => {
    const hookName = toHookName({ tableName: 'people', operation: 'Delete' });
    expect(hookName).toBe('useDeletePerson');
  });

  it('should return the hook name for a table named people and the GetAll operation', () => {
    const hookName = toHookName({ tableName: 'people', operation: 'GetAll' });
    expect(hookName).toBe('useGetAllPeople');
  });
});
