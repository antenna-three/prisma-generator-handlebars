# prisma-generator-handlebars

Generate any text files from Prisma schema with [Handlebars](https://handlebarsjs.com) templates.

You can generate files such as:

- Database documents
- Entity-relation diagrams
- GraphQL schema

## Getting started

1. Install this generator.

   ```
   npm install -D prisma-generator-handlebars
   ```

2. Add the generator to `schema.prisma`. Change `output` and `inputBasePath` options according to your use case.

   ```prisma
   generator docs {
       provider      = "prisma-generator-handlebars"
       output        = "docs"
       inputBasePath = "docs"
   }
   ```

3. Create `{{ inputBasePath }}/templates` directory next to `schema.prisma`.

   Put some handlebars template files in `templates` directory.

   [`docs/templates/models.md.handlebars`](prisma/docs/templates/models.md.handlebars)

   ```handlebars
   Models:

   {{#each datamodel.models}}
   - {{name}}
     {{#each fields}}
     - {{name}}
     {{/each}}
   {{/each}}

   Enums:

   {{#each datamodel.enums}}
   - {{name}}
     {{#each values}}
     - {{name}}
     {{/each}}
   {{/each}}
   ```

4. Run the generate command.

   ```
   npx prisma generate
   ```

5. Templates will be rendered with Prisma [`DMMF.Document`](https://github.com/prisma/prisma/blob/main/packages/generator-helper/src/dmmf.ts) object as context.

   [`docs/models.md`](prisma/docs/models.md)

   ```markdown
   Models:

   - User
     - id
     - email
     - type
     - name
     - posts
   - Post
     - id
     - createdAt
     - updatedAt
     - title
     - content
     - published
     - viewCount
     - author
     - authorId

   Enums:

   - UserType
     - ADMIN
     - USER
   ```

## Options

```prisma
generator handlebars {
    provider      = "prisma-generator-handlebars"
    output        = "./generated"
    inputBasePath = "."
    templates     = "./templates"
    partials      = "./partials"
    helpers       = "./helpers.js"
    options       = "./options.js"
}
```

| Option          | Default        | Description                                                                                                                                                                                                                   |
| --------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `output`        | `./generated`  | Generator output directory path. Relative paths are resolved from `schema.prisma`.                                                                                                                                            |
| `inputBasePath` | `.`            | Base path for input paths. Relative paths are resolved from `schema.prisma`.                                                                                                                                                  |
| `templates`     | `./templates`  | Input template directory path. All files under this directory will be compiled as handlebars templates.                                                                                                                       |
| `partials`      | `./partials`   | Input partial directory path. All files under this directory will be registered as handlebars partials. Partial names will be based on files' pathname relative to the directory, removing `.handlebars` extension if exists. |
| `helpers`       | `./helpers.js` | Input helper script file path. All functions exported from the file will be registered as helpers. Helper names will be based on functions' exported name.                                                                    |
| `options`       | `./options.js` | Input option script file path. Export object with names `compileOptions` and `runtimeOptions`.                                                                                                                                |

## Helpers

[pluralize](https://github.com/plurals/pluralize) and methods in [change-case](https://github.com/blakeembrey/change-case) are registered as helpers by default.

## Notes

Prisma DMMF is an internal AST and no backward compatibilities are guaranteed. Beware of breaking changes when updating your prisma cli versions.
