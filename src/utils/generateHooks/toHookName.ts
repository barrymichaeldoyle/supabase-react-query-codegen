import { plural, singular } from 'pluralize';

interface ToHookNameArgs {
  tableName: string;
  operation: 'GetAll' | 'Get' | 'Add' | 'Update' | 'Delete';
}

export function toHookName({ tableName, operation }: ToHookNameArgs): string {
  const pascalCaseTableName = tableName.replace(/(?:^|_|-)(\w)/g, (_, char) =>
    char.toUpperCase()
  );

  const singularTableName =
    operation === 'GetAll'
      ? plural(pascalCaseTableName)
      : singular(pascalCaseTableName);

  return `use${operation}${singularTableName}`;
}
