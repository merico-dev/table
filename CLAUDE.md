# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTable is a flexible and powerful low-code data workflow platform built with TypeScript, React, and Node.js. It allows users to build data presentations using SQL and multiple data sources including big data, with natural integration to Dev Lake and Dev Analysis.

## Architecture

This is a monorepo using Nx workspace with the following main packages:

- **api/** - Backend API server (Express.js, TypeORM, PostgreSQL)
- **dashboard/** - Core dashboard component library (React, MobX, ECharts)
- **website/** - Main web application (React, React Router)
- **settings-form/** - Settings management forms (React)
- **shared/** - Shared utilities and API client

## Development Commands

### Setup
```bash
# Install dependencies (managed by yarn workspaces)
yarn install

# Install volta and nx globally (required)
volta install nx
```

### Development
```bash
# Build dashboard & settings-form (required for web app)
nx run-many --target=dev-build --all

# Start api & website in development mode
nx run-many --target=dev --all

# Visit http://localhost:32000/dashboard
```

### Testing
```bash
# Run all tests
nx run-many --target=test

# Run specific test suites
cd api && yarn test:e2e    # End-to-end tests
cd api && yarn test:i       # Integration tests  
cd api && yarn test:u       # Unit tests
cd dashboard && yarn test   # Vitest tests
```

### Quality Assurance
```bash
# Lint all projects
nx run-many --target=lint

# Type checking
nx run-many --target=check
```

### Database Operations (API)
```bash
cd api

# Create migration
yarn migration:create <name>

# Run migrations
yarn migration:run

# Revert migration
yarn migration:revert
```

## Key Technologies

- **Backend**: Express.js, TypeORM, PostgreSQL, Socket.io, JWT authentication
- **Frontend**: React 18, TypeScript, MobX State Tree, ECharts, Monaco Editor
- **Build Tools**: Nx workspace, Vite, Rollup
- **Testing**: Jest, Vitest, Cypress
- **UI**: Mantine UI, Emotion CSS-in-JS, DnD Kit

## Important Patterns

### API Structure
- Controllers in `api/src/controller/` handle HTTP requests
- Services in `api/src/services/` contain business logic
- Models in `api/src/models/` define TypeORM entities
- Migrations in `api/src/data_sources/migrations/` manage database schema

### Dashboard Architecture
- Dashboard editor in `dashboard/src/dashboard-editor/`
- Dashboard renderer in `dashboard/src/dashboard-render/`
- Visualization components use plugin architecture
- State management with MobX State Tree
- Panel system with drag-and-drop layout

### Plugin System
- Visualization components are pluggable
- Custom functions can be added
- SQL snippets are reusable
- Data sources support multiple database types

## Environment Setup

The application requires:
- Node.js (managed by Volta)
- PostgreSQL database
- Redis for caching
- Yarn package manager

## Development Workflow

1. Changes to dashboard/settings-form require rebuilding: `nx run-many --target=dev-build --all`
2. API changes automatically restart with nodemon
3. Website changes hot-reload with Vite
4. Database changes require TypeORM migrations
5. All code must pass linting and type checking