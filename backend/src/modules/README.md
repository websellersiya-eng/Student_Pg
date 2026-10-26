# Backend Modules

Each major feature module follows this shape:

```text
module.routes.ts
module.controller.ts
module.service.ts
module.repository.ts
module.schema.ts
module.types.ts
module.constants.ts
```

Routes attach middleware and validation. Controllers handle HTTP input/output. Services contain business rules. Repositories own Prisma queries.
