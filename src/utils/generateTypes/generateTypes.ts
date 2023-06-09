import type { Symbol } from 'ts-morph';

import { toTypeName } from './toTypeName';

interface GenerateTypesArg {
  table: Symbol;
  tableName: string;
}

export function generateTypes({
  tableName,
  table,
}: GenerateTypesArg): string[] {
  // Get the table type
  const tableType = table.getTypeAtLocation(table.getValueDeclarationOrThrow());

  // Find the 'Row' property within the table type
  const rowProperty = tableType.getProperty('Row');
  if (!rowProperty) {
    throw new Error(`Unable to find Row property type for ${tableName}.`);
  }

  // Get the type of the 'Row' property
  const rowType = rowProperty.getTypeAtLocation(
    rowProperty.getValueDeclarationOrThrow()
  );

  const insertProperty = tableType.getProperty('Insert');
  if (!insertProperty) {
    throw new Error(`Unable to find insert property type for ${tableName}.`);
  }

  const insertType = insertProperty.getTypeAtLocation(
    insertProperty.getValueDeclarationOrThrow()
  );

  const updateProperty = tableType.getProperty('Update');
  if (!updateProperty) {
    throw new Error(`Unable to find update property type for ${tableName}.`);
  }

  const updateType = updateProperty.getTypeAtLocation(
    updateProperty.getValueDeclarationOrThrow()
  );

  const rowTypeString = rowType.getText();
  const insertTypeString = insertType.getText();
  const updateTypeString = updateType.getText();

  const types: string[] = [];

  types.push(
    `export type ${toTypeName({
      operation: 'Get',
      tableName,
    })} = ${rowTypeString};`,
    `export type ${toTypeName({
      operation: 'Add',
      tableName,
    })} = ${insertTypeString};`,
    `export type ${toTypeName({
      operation: 'Update',
      tableName,
    })} = { id: string; changes: ${updateTypeString} };
    `
  );

  return types;
}
