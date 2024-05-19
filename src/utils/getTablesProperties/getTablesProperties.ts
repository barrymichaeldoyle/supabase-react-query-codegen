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

  const types = sourceFile.getTypeAliases();

  // Find the 'Tables' type alias
  const dbTypeRef = types.find((type) => type.getName() === 'Database');

  if (!dbTypeRef) {
    throw new Error('No Database type alias found.');
  }

  const databaseType = dbTypeRef.getType();

  if (!databaseType) {
    throw new Error('No Database type found.');
  }

  // const databaseInterface = sourceFile.getTypeAliasOrThrow('Database');
  const publicProperty = databaseType.getProperty('public');
  const publicType = publicProperty?.getDeclaredType();

  if (!publicType) {
    throw new Error('No public property found within the Database type.');
  }

  const tablesProperty = publicType
    .getApparentProperties()
    .find((property) => property.getName() === 'Tables');

  if (!tablesProperty) {
    throw new Error('No Tables property found within the Database type.');
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
