export function toTypeName(tableName: string, operation: string): string {
  const camelCaseTableName = tableName.replace(/(_\w)/g, (match) =>
    match[1].toUpperCase()
  );

  const formattedTableName =
    camelCaseTableName[0].toUpperCase() + camelCaseTableName.slice(1);

  if (operation !== 'GetAll') {
    return `${operation}${formattedTableName.slice(0, -1)}`;
  } else {
    return `${operation}${formattedTableName}`;
  }
}
