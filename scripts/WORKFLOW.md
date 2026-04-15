# Prisma Workflow

## Overview

Two separate generation steps:

| Command | Purpose | Output |
|---------|--------|--------|
| `pnpm prisma generate` | Prisma Client (runtime queries) | `.prisma/client/` |
| `pnpm generate:types` | TypeScript types (TS code) | `src/types/prisma.d.ts` |

## Why Both?

```
prisma generate    →  for: prisma.users.findUnique()
generate:types →  for: import type { PrismaClient }
```

- **prisma generate**: Generates `PrismaClient` class for DB operations (runtime)
- **generate:types**: Generates manual types for type safety in code (compile-time)

Both required.

## Adding a New Model

### 1. Edit Schema

```bash
# Edit prisma/schema.prisma
model Apartment {
  id        String  @id @default(cuid())
  address   String
  city      String
  ...
}
```

### 2. Create Migration

```bash
pnpm prisma migrate dev --name add_apartment
```

### 3. Generate Both

```bash
# 1. Prisma Client (DB operations)
pnpm prisma generate

# 2. TypeScript types (type definitions)
pnpm generate:types
```

### 4. Verify

```bash
# Check generated types
cat src/types/prisma.d.ts
```

## Adding Field to Existing Model

### 1. Edit Schema

```bash
# Edit prisma/schema.prisma
model Users {
  ...
  phone  String?  # ← new field
}
```

### 2. Migration + Generate

```bash
pnpm prisma migrate dev --name add_phone_to_users
pnpm prisma generate
pnpm generate:types
```

## Commands Reference

```bash
# Create/update migration
pnpm prisma migrate dev --name <name>

# Rollback migration
pnpm prisma migrate rollback

# Apply migrations (production)
pnpm prisma migrate deploy

# Prisma Client (runtime)
pnpm prisma generate

# TypeScript types (manual)
pnpm generate:types

# Both at once
pnpm prisma generate && pnpm generate:types
```

## File Locations

```
prisma/
├── schema.prisma          # Schema definition
├── migrations/        # Migration files
└── generated/       # Generated Prisma Client

src/types/
└── prisma.d.ts      # Generated TypeScript types

scripts/
└── generate-prisma-types.ts  # Generator script
```

## Troubleshooting

### Types not updating?
```bash
pnpm generate:types
```

### Prisma Client stale?
```bash
pnpm prisma generate
```

### Both stale?
```bash
pnpm prisma generate && pnpm generate:types
```