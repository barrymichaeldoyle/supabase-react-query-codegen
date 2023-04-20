import { toTypeName } from './toTypeName';

describe('toTypeName', () => {
  it('should return the type name for a table with a single word name.', () => {
    expect(toTypeName({ operation: 'Get', tableName: 'users' })).toBe('User');
    expect(toTypeName({ operation: 'Update', tableName: 'users' })).toBe(
      'UpdateUserRequest'
    );
  });

  it('should return the type name for a table with a snake_case name.', () => {
    expect(toTypeName({ operation: 'Get', tableName: 'todo_items' })).toBe(
      'TodoItem'
    );
    expect(toTypeName({ operation: 'Update', tableName: 'todo_items' })).toBe(
      'UpdateTodoItemRequest'
    );
  });

  it('should return the type name for a table with a multi-word snake_case name', () => {
    expect(
      toTypeName({ operation: 'Get', tableName: 'order_item_details' })
    ).toBe('OrderItemDetail');
    expect(
      toTypeName({ operation: 'Update', tableName: 'order_item_details' })
    ).toBe('UpdateOrderItemDetailRequest');
  });

  it('should return the type name for a table named `people` (singualize lib test)', () => {
    expect(toTypeName({ operation: 'Get', tableName: 'people' })).toBe(
      'Person'
    );
    expect(toTypeName({ operation: 'Update', tableName: 'people' })).toBe(
      'UpdatePersonRequest'
    );
  });

  it('should return the type name for a table named `parties` (singualize lib test)', () => {
    expect(toTypeName({ operation: 'Get', tableName: 'parties' })).toBe(
      'Party'
    );
    expect(toTypeName({ operation: 'Update', tableName: 'parties' })).toBe(
      'UpdatePartyRequest'
    );
  });
});
