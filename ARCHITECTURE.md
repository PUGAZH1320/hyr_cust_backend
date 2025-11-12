# Backend Architecture Documentation

This document outlines the architecture and code standards for the Hyr Customer Backend application.

## Project Structure

```
src/
├── constants/          # Application constants (status codes, roles, enums)
├── controllers/        # Request handlers (thin layer, delegates to services)
├── db/                 # Database configuration
├── errors/             # Custom error classes
├── handlers/           # Response handlers
├── interfaces/         # TypeScript interfaces
├── locales/            # Translation files (JSON)
├── middleware/         # Express middleware (auth, validation, error handling)
├── models/             # Database models (Sequelize)
├── routes/             # Route definitions
├── services/           # Business logic layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── validators/         # Validation schemas (Zod)
```

## Key Patterns

### 1. Controller Pattern
- Class-based controllers
- Use `catchAsync` wrapper for all async handlers
- Always use `handleSuccess` for successful responses
- Pass errors to `next()` middleware
- Export singleton instances

### 2. Service Pattern
- Contains business logic and database operations
- Use transactions for operations that modify data
- Always check for soft-deleted records
- Throw custom errors instead of returning null
- Support optional transaction parameter for nested operations

### 3. Model Pattern
- Class-based models extending Sequelize Model
- Use `paranoid: true` for soft deletes
- Always include `timestamps: true`

### 4. Error Handling
- Use `catchAsync` for async route handlers
- Throw `AppError` for operational errors
- Centralized error handler middleware (must be last)
- Include translation support in error messages

### 5. Validation
- Use Zod for validation
- Validate all inputs using Zod schemas
- Use `validateRequest` middleware

### 6. Authentication
- Use JWT for authentication
- `authenticateToken` middleware validates tokens
- Token extracted from `Authorization: Bearer <token>` header

### 7. Internationalization
- Use `i18n` package for translations
- Language extracted from `X-Language` header
- All user-facing messages use translation keys
- Translation files in `locales/` directory

## File Naming Conventions

- **Files**: kebab-case (e.g., `user.controller.ts`, `error-handler.middleware.ts`)
- **Classes**: PascalCase (e.g., `UserController`, `AppError`)
- **Functions/Variables**: camelCase (e.g., `createUser`, `userId`)
- **Constants**: camelCase with descriptive names (e.g., `errorCodes`, `SupportedLanguages`)
- **Enums**: PascalCase (e.g., `SupportedLanguages`)

## Import Pattern

Always use `.js` extensions in imports (TypeScript requirement for ESM):

```typescript
import { User } from "../models/user.model.js";
import { sequelize } from "../db/config.js";
```

## Environment Variables

Required environment variables (see `.env.example`):

- `PORT` - Server port
- `NODE_ENV` - Environment (development/production/test)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `LOG_LEVEL` - Logging level (info, error, debug, etc.)

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Watch mode
npm run watch
```

## Adding New Features

1. **Create Model** in `src/models/`
2. **Create Service** in `src/services/`
3. **Create Controller** in `src/controllers/`
4. **Create Validator** in `src/validators/`
5. **Create Routes** in `src/routes/`
6. **Register Routes** in `src/routes/index.ts`
7. **Add Translations** to `src/locales/en.json` and `src/locales/it.json`

## Example: User Module

See the example User module for reference:
- Model: `src/models/user.model.ts`
- Service: `src/services/user.service.ts`
- Controller: `src/controllers/user.controller.ts`
- Validator: `src/validators/user.validator.ts`
- Routes: `src/routes/user.routes.ts`

