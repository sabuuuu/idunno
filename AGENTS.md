# Agent Configuration for NoSearch

## ⚠️ ENFORCEMENT NOTICE

**ALL (MUST) rules are MANDATORY. NO EXCEPTIONS.**

- Reference rule numbers when making decisions (e.g., "Following CD-1...")
- Check ALL applicable rules before ANY code changes
- Immediately correct violations

## Project Overview

**NoSearch** - A movie recommendation application that uses AI to suggest films based on user preferences. Features include question-based recommendation flow, server-side rendering for shareable results, and feedback collection.

## Purpose

These rules ensure maintainability, safety, and developer velocity for the NoSearch platform.
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

## Rule Taxonomy for NoSearch Code Configuration

Each rule belongs to a category and is labeled with a prefix:

- **BC** = Before Coding → rules to follow before writing any code.
- **CD** = Coding → rules to follow while writing code.
- **SC** = Security → rules ensuring security & data safety.
- **TS** = Testing → rules for validation, testing, and QA.
- **GIT** = Git → rules for version control and commit practices.
- **DC** = Development Commands → rules controlling execution of dev commands and scripts.
- **OF** = Output Formatting → rules about how code is delivered/presented.


### BC - Before Coding Rules

- **BC-1** (MUST) Ask clarifying questions if requirements are ambiguous.
- **BC-2** (SHOULD) Draft and confirm an approach for complex tasks.
- **BC-3** (SHOULD) Compare ≥ 2 approaches if available, with pros/cons.
- **BC-4** (MUST) Read `CONTEXT.md` to understand business definitions, domain terminology, and user workflows.
- **BC-5** (SHOULD) Check if similar functionality already exists (e.g., modals, form validation, DB queries) to avoid duplication.
- **BC-6** (MUST) Trace execution paths from entry point to database layer before modifying code.

### CD - Coding Rules

- **CD-1** (MUST) Name functions with existing domain vocabulary for consistency.
- **CD-2** (MUST) Follow TanStack Start conventions for file-based routing and server functions.
- **CD-3** (MUST) Keep functions/classes single-responsibility. Do not write generic wrappers for single-use logic.
- **CD-4** (MUST) Avoid hard-coded secrets; use configs/env vars.
- **CD-5** (MUST) Handle errors gracefully with meaningful messages and strict error boundaries.
- **CD-6** (MUST) Use TypeScript strict mode and avoid `any` or loose type assertions.
- **CD-7** (MUST) Use Drizzle transactions for all multi-step mutations where failure of one query leaves the DB in an inconsistent state.
- **CD-8** (MUST) Run payloads through Zod schemas before hitting DB queries.
- **CD-9** (MUST) Ensure high-volume lookup fields query fields covered by database indexes.
- **CD-10** (MUST) Emulate the spacing, nesting, folder structure, and naming style of adjacent files.

### SC - Security Rules

- **SC-1** (MUST) Sanitize all user inputs.
- **SC-2** (MUST) Prevent common vulnerabilities (XSS, CSRF, SQLi).
- **SC-4** (SHOULD) Apply least-privilege principle in access control.
- **SC-5** (MUST) Validate and sanitize data before database operations.
- **SC-6** (MUST) Use HTTPS for all data transmission.

### TS - Testing Rules

- **TS-1** (SHOULD) Follow TDD: scaffold stub → write failing test → implement.
- **TS-2** (MUST) Write unit tests for critical business logic.
- **TS-4** (MUST) Test API endpoints with various inputs and edge cases.
- **TS-5** (MUST) Run tests before committing code changes.
- **TS-6** (MUST) Run Compilation Checks to ensure no TypeScript warnings or errors exist.
- **TS-7** (MUST) Run Linter to format code and verify no ESLint rules are broken.

### GIT - Git Rules

- **GIT-1** (MUST) Write clear, concise commit messages following conventional commits.
- **GIT-2** (SHOULD) Include scope if applicable: `type(scope): description`.
- **GIT-3** (MUST) **NEVER** include AI attribution in commit messages.
- **GIT-4** (MUST) Perform a self-review of the git diff line-by-line before committing.
- **GIT-5** (MUST) Identify and remove dead code, `console.log`, `debugger`, and mock variables before committing.

**Commit Types:**

- ✨ feat: New features
- 🐛 fix: Bug fixes
- 📝 docs: Documentation changes
- ♻️ refactor: Code restructuring without changing functionality
- 🎨 style: Code formatting, missing semicolons, etc.
- ⚡️ perf: Performance improvements
- ✅ test: Adding or correcting tests
- 🧑💻 chore: Tooling, configuration, maintenance
- 🚧 wip: Work in progress
- 🔥 remove: Removing code or files
- 🚑 hotfix: Critical fixes
- 🔒 security: Security improvements

### DC - Development Commands Rules

- **DC-1** (MUST) NEVER run any development commands unless the user explicitly requests it.
- **DC-2** (MUST) NEVER suggest or imply running any script commands in responses unless requested.
- **DC-3** (MUST) Do not automatically start the development server without direct user instruction.
- **DC-4** (MUST) Do not run type-check, lint, format, or verification commands after code changes unless requested.
- **DC-5** (SHOULD) If a command's output would be helpful, ask for confirmation before running it.

### OF - Output Formatting Rules

- **OF-1** (MUST) Keep communication concise, direct, and actionable when presenting results.
- **OF-2** (MUST) Include meaningful comments ONLY for explaining non-obvious business rules, complex technical constraints, or critical architectural decisions.
- **OF-3** (MUST) Summarize findings, changes, and risks in bulleted lists.
- **OF-4** (MUST) Avoid conversational pleasantries or redundant explanations of obvious code.
- **OF-5** (SHOULD) Use descriptive variable and function names over comments when possible.

## Tech Stack

### Core Framework

- **Framework**: TanStack Start (full-stack React framework)
- **TypeScript**: JavaScript with syntax for types

### Database & Backend

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod

### State Management & Data

- **State/Fetching**: TanStack Query (caching) - used for server function calls
- **Routing**: TanStack Router (file-based routing)

### UI Components

- **Component Library**: shadcn/ui (Radix UI primitives with Tailwind CSS)
- **Styling**: Tailwind CSS

## Package Management & Environment

### Package Management

- **Package Manager**: Use `pnpm` (or project standard)
- **Dependency Management**: Keep dependencies up-to-date and remove unused packages

### Development Environment

- **Environment Variables**: Never commit `.env` files with actual secrets to version control

## Visual Development

### Design Principles

- Use shadcn/ui components as the primary component library
- Follow modern UI/UX best practices with Tailwind CSS
- Prefer shadcn/ui primitives over custom components when available

## Development Philosophy

### Code Quality & Architecture

- **Minimal Necessary Changes**: Touch only the lines of code required to fulfill the task.
- **Cohesive Implementations**: Ensure code additions fit logically inside the existing structure without leaving dead ends or unused variables.
- **Avoid Overengineering**: Address only the immediate requirements. Do not write code for hypothetical future requirements.
- **Prefer Consistency over Cleverness**: Choose standard, straightforward solutions over esoteric language tricks or complex patterns.

### Refactoring Philosophy

- **Refactoring Triggers**: Refactoring is authorized ONLY to reduce complexity, remove code duplication, or improve maintainability.
- **Refactoring Constraints**: NEVER refactor for style preferences alone if it diverges from existing codebase conventions. Do not perform speculative refactors.

### Security & Reliability

- **Security First**: Proactively identify potential security vulnerabilities and provide solutions.
- **Error Handling**: Implement comprehensive error boundaries and graceful degradation.

## Framework Usage Rules

- Follow TanStack Start conventions for file-based routing and server functions.
- Use TanStack Query for all server function calls (mutations, queries).
- Use Drizzle best practices for schema migrations and transaction safety.
- Use shadcn/ui components for UI primitives.

## Component Guidelines

### File & Naming Conventions

- Emulate the spacing, nesting, folder structure, and naming style of adjacent files.
- Use shadcn/ui components from `src/components/ui/` for base primitives.
- Build feature-specific components in feature folders.

### Logic Separation

- Keep code flat. Do not write generic wrappers for single-use logic.
- Keep functions small and cohesive. If a function grows beyond 30 lines, evaluate splitting it.
- Use TanStack Query hooks for server function interactions.

## Key Directories

```
.
├── src/
│   ├── routes/                         # file-based routing (tanstack start)
│   │   ├── __root.tsx                  # root layout — fonts, providers, <Outlet />
│   │   ├── index.tsx                   # landing → redirects to /ask
│   │   ├── ask.tsx                     # question flow route
│   │   └── result/
│   │       └── $sessionId.tsx          # server-rendered result page
│   │
│   ├── features/                       # feature-based organization
│   │   ├── question-flow/              # question flow feature
│   │   │   ├── components/             # feature-specific components
│   │   │   ├── hooks/                  # feature-specific hooks
│   │   │   ├── server/                 # feature-specific server functions
│   │   │   └── types/                  # feature-specific types
│   │   │
│   │   ├── recommendation/             # recommendation feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── server/
│   │   │   └── types/
│   │   │
│   │   └── feedback/                   # feedback feature
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── server/
│   │       └── types/
│   │
│   ├── components/                     # shared components
│   │   └── ui/                         # shadcn/ui primitives
│   │
│   ├── lib/                            # shared utilities
│   │   ├── db/                         # drizzle client & schema
│   │   ├── llm/                        # LLM client & prompts
│   │   └── tmdb/                       # TMDB client & queries
│   │
│   └── types/                          # shared TypeScript types
│
├── drizzle/                            # generated by drizzle-kit
├── scripts/                            # utility scripts
├── CONTEXT.md                          # Core business definitions and domain terminology
└── AGENTS.md                           # Global AI agent execution protocol
```

## Key Features

- AI-powered movie recommendations
- Question-based preference flow
- Server-side rendered shareable results
- Feedback collection (thumbs up/down)
