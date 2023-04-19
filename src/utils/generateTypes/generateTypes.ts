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
    `export type ${toTypeName(tableName, 'Get')}Request = string;`,
    `export type ${toTypeName(tableName, 'Get')}Response = ${rowTypeString};`,
    `export type ${toTypeName(
      tableName,
      'GetAll'
    )}Response = ${rowTypeString}[];`,
    `export type ${toTypeName(tableName, 'Add')}Request = ${insertTypeString};`,
    `export type ${toTypeName(
      tableName,
      'Update'
    )}Request = { id: string; changes: ${updateTypeString} };`,
    `export type ${toTypeName(tableName, 'Delete')}Request = string;`
  );

  return types;
}
