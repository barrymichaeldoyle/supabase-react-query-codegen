import { ModuleKind, Project, ScriptTarget } from 'ts-morph';

export function getTablesProperties(typesPath: string) {
  const project = new Project({
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
      strictNullChecks: true,
    },
  });

  const sourceFile = project.addSourceFileAtPath(typesPath);

  // Find the 'Tables' type alias
  // `supabase gen types` emits `export type Database = {...}`; older
  // versions emitted `export interface Database {...}`. Support both.
  const databaseDeclaration =
    sourceFile.getInterface('Database') ?? sourceFile.getTypeAlias('Database');
  if (!databaseDeclaration) {
    throw new Error(`No Database type or interface found in ${typesPath}.`);
  }
  const publicSymbol = databaseDeclaration.getType().getProperty('public');
  if (!publicSymbol) {
    throw new Error('No public schema found within the Database type.');
  }
  const publicType = publicSymbol.getTypeAtLocation(databaseDeclaration);

  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  if (!tablesProperty) {
    throw new Error('No Tables property found within the Database interface.');
  }

  const tablesType = project
    .getProgram()
    .getTypeChecker()
    .getTypeAtLocation(tablesProperty.getValueDeclarationOrThrow());
  const tablesProperties = tablesType.getProperties();

  if (tablesProperties.length === 0) {
    throw new Error('No tables found within the Tables property.');
  }

  return tablesProperties;
}
