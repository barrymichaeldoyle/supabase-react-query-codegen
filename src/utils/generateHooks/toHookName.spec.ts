import { toHookName } from './toHookName';

describe('toHookName', () => {
  it('should return the hook name for a table with a single word name.', () => {
    expect(toHookName({ tableName: 'users', operation: 'Get' })).toBe(
      'useGetUser'
    );
    expect(toHookName({ tableName: 'users', operation: 'GetAll' })).toBe(
      'useGetAllUsers'
    );
  });

  it('should return the hook name for a table with a snake_case name.', () => {
    expect(
      toHookName({
        tableName: 'todo_items',
        operation: 'Update',
      })
    ).toBe('useUpdateTodoItem');
    expect(
      toHookName({
        tableName: 'todo_items',
        operation: 'GetAll',
      })
    ).toBe('useGetAllTodoItems');
  });

  it('should return the hook name for a table with a multi-word snake_case name', () => {
    expect(
      toHookName({
        tableName: 'order_item_details',
        operation: 'Delete',
      })
    ).toBe('useDeleteOrderItemDetail');
    expect(
      toHookName({
        tableName: 'order_item_details',
        operation: 'GetAll',
      })
    ).toBe('useGetAllOrderItemDetails');
  });

  it('should return the hook name for a table named `people` (singualize lib test)', () => {
    expect(toHookName({ tableName: 'people', operation: 'Delete' })).toBe(
      'useDeletePerson'
    );
    expect(toHookName({ tableName: 'people', operation: 'GetAll' })).toBe(
      'useGetAllPeople'
    );
  });

  it('should return the hook name for a table named `parties` (singualize lib test)', () => {
    expect(toHookName({ tableName: 'parties', operation: 'Delete' })).toBe(
      'useDeleteParty'
    );
    expect(toHookName({ tableName: 'parties', operation: 'GetAll' })).toBe(
      'useGetAllParties'
    );
  });

  it('should return the hook name for a table named `to-do` (singualize lib test)', () => {
    expect(toHookName({ tableName: 'to-do', operation: 'Delete' })).toBe(
      'useDeleteToDo'
    );
    expect(toHookName({ tableName: 'to-do', operation: 'GetAll' })).toBe(
      'useGetAllToDos'
    );
  });
});
