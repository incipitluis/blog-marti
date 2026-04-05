# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Workflow

Before modifying any file, ALWAYS:
1. Explain the decision: the **why** (reason for the change), the **how** (technical approach), and the **where** (affected files)
2. Ask the user questions if there is any ambiguity or multiple possible approaches
3. Wait for user confirmation before applying changes

## Build & Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Lint + format + Next.js build (runs build.js)
npm run lint         # ESLint with auto-fix
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router, React 18, TypeScript
- **Database**: PostgreSQL via Supabase
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI primitives)

## Code Style Conventions

### TypeScript/React
- Use `type` over `interface`
- Inline prop types directly in function parameters, not separate types
- Use named exports for React components
- No comments in code - code should be self-explanatory
- No need to import React

### Component Extraction
When extracting a component named "X", create it in a `components/` folder at the same level as the current file using kebab-case (e.g., `my-component.tsx`).

### Formatting (Prettier)
- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas everywhere
- Tailwind classes are auto-sorted

### File & Import Rules
- Never create index files (index.ts, index.tsx)
- Never use re-exports (`export { X } from` or `export * from`)
- Always use path aliases (@/) for imports instead of deep relative paths

### Git
- Never add `Co-Authored-By` lines to commit messages

### Build & Verification Workflow
- Never run `npm run build` automatically - only when explicitly requested
- After editing code, always run:
  1. `npm run lint` - to check and fix linting issues
  2. `npx tsc --noEmit` - to verify TypeScript types
- **Antes de ejecutar cualquier comando en la terminal**, explicar brevemente qué hace y para qué, justo antes de lanzarlo



### Database / Supabase
- **NUNCA aplicar migraciones directamente a la base de datos** - No usar `apply_migration`, `execute_sql` ni ninguna herramienta que ejecute SQL contra Supabase
- Siempre proporcionar el código SQL al usuario para que lo aplique manualmente en el SQL Editor de Supabase
- Presentar el SQL formateado y listo para copiar/pegar
- **No incluir comentarios en el SQL** (ni `--` ni `/* */`) para evitar errores al pegar

## Environment Setup
Database credentials, API keys, etc. are configured in `.env.local`.
