import { singular } from 'pluralize';

interface ToTypeNameArgs {
  tableName: string;
  operation: 'Get' | 'Add' | 'Update';
}

export function toTypeName({ tableName, operation }: ToTypeNameArgs): string {
  const pascalCaseTableName = tableName.replace(/(?:^|_|-)(\w)/g, (_, char) =>
    char.toUpperCase()
  );

  const formattedTableName = singular(pascalCaseTableName);

  if (operation === 'Get') {
    return formattedTableName;
  }

  return `${operation}${formattedTableName}Request`;
}
