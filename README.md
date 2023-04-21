[![npm version](https://img.shields.io/npm/v/supabase-react-query-codegen.svg)](https://www.npmjs.com/package/supabase-react-query-codegen) [![npm](https://img.shields.io/npm/dt/supabase-react-query-codegen.svg)](https://www.npmjs.com/package/supabase-react-query-codegen)
 [![Known Vulnerabilities](https://snyk.io/test/github/barrymichaeldoyle/supabase-react-query-codegen/badge.svg)](https://snyk.io/test/github/barrymichaeldoyle/supabase-react-query-codegen) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Warning:** This project is still in development and is not yet ready for use. Once it is ready, I will release v1 on npm. Expect every update to be a major change. ETA for v1 is early May 2023.

# Supabase React Query Codegen

A CLI tool to automatically generate React Query hooks and TypeScript types for your Supabase Database, streamlining data fetching and enhancing developer productivity.

## Features

- Automatically generates TypeScript types and React Query hooks for your Supabase database.
- Reduces manual work and the likelihood of errors.
- Increases developer productivity by providing ready-to-use hooks for fetching data.

## Installation

Install the package globally using npm:

```bash
npm install -g supabase-react-query-codegen
```

Or with Yarn:

```bash
yarn global add supabase-react-query-codegen
```

## Usage

1. First, generate a TypeScript types file for your Supabase database (if you haven't already):

```bash
supabase gen types typescript --project-id "<your-project-id>" --schema public > path/to/types.ts
```

2. Create a `supebase-react-query-codegen.config.json` file witht he following properties:
```json
{
  // required
  "outputPath": "src/generated.ts", // path where generated code will go
  "typesPath": "src/types.ts", // path to your types file generated in step 1

  // optional
  "prettierConfigPath": ".prettierrc", // path to your .prettierrc file
  "relativeSupabasePath": "./supabase", // where your supabase client is relative to your generated file
  "supabaseExportName": "supabase", // if not supplied, default will be imported in your generated file
}
```

3. Run the `generate` command, passing in the required arguments:

```bash
npx supabase-react-query-codegen generate supabase-react-query-codegen.config.json
```

## Generated Hooks

The following hooks will be generated for each table in your database, if you have a table called `todo_items` then you will get these hooks:

- `useGetTodoItem`: Fetch a single row by its ID.
- `useGetAllTodoItems`: Fetch all rows in the table.
- `useAddTodoItem`: Add a new row to the table.
- `useUpdateTodoItem`: Update an existing row in the table.
- `useDeleteTodoItem`: Delete a row from the table by its ID.

Note that `todo_items` is converted to PascalCase in the hook names.

## Generated Types

For convience this tool also generates types from your Database schema.
The following types will be generated for each table in your database, if you have a table called `todo_items` then you will get these types:

- `TodoItem`
- `AddTodoItemRequest`
- `UpdateTodoItemRequest`


## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository. If you'd like to contribute code, feel free to fork the repository and submit a pull request.

### Contributers

Get yourself added to this list by helping me out wherever you can!

- [@barrymichaeldoyle](https://github.com/barrymichaeldoyle) (Founder)

## License

MIT
