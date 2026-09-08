# Code Style

This section describes the general coding conventions used in the TMS project.

* [Frontend Code Style](frontend.md)
* [Backend Code Style](backend.md)

## General Rules

### Language

All application code must be written in TypeScript.

### Formatting

Code is formatted using Prettier.

Do not manually format code in a way that conflicts with the Prettier configuration.

### Linting

All code must pass ESLint checks without errors.

Do not disable ESLint rules without explaining the reason.

### Naming

Variable, function, and file names should clearly describe their purpose.

Avoid unclear abbreviations.

### Type Safety

Avoid using `any`.

Use explicit types when TypeScript cannot infer them correctly.

### Simplicity

Do not introduce abstractions or generic solutions before there is a real need for them.
