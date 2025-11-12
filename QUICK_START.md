# Quick Start Guide

## Project Structure Overview

```
src/
├── constants/          # errorCodes, SupportedLanguages, StatusCode
├── controllers/        # HTTP request handlers (thin layer)
├── db/                 # Sequelize database configuration
├── errors/             # Custom error classes (NotFoundError, BadRequestError, etc.)
├── handlers/           # Response formatting utilities
├── interfaces/         # TypeScript interfaces
├── locales/            # i18n translation files (en.json, it.json)
├── middleware/         # Express middleware (auth, validation, error handling)
├── models/             # Sequelize database models
├── routes/             # Route definitions
├── services/           # Business logic layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (logger, catchAsync, etc.)
└── validators/         # Zod validation schemas
```

## Key Files

### Core Files
- `src/index.ts` - Main application entry point
- `src/db/config.ts` - Database configuration
- `src/utils/logger.ts` - Winston logger setup
- `src/utils/i18n-config.ts` - i18n configuration

### Middleware
- `src/middleware/error-handler.middleware.ts` - Centralized error handling
- `src/middleware/auth.middleware.ts` - JWT authentication
- `src/middleware/validate-request.middleware.ts` - Request validation
- `src/middleware/language-middleware.ts` - Language detection

### Utilities
- `src/utils/app-error.ts` - Base error class
- `src/utils/catch-async.ts` - Async error wrapper
- `src/handlers/response-handler.ts` - Success response handler

## Creating a New Module

### 1. Create Model
```typescript
// src/models/example.model.ts
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

export class Example extends Model {
  public id!: number;
  // ... other fields
}

Example.init({ /* ... */ }, {
  sequelize,
  tableName: "examples",
  paranoid: true,
  timestamps: true,
});
```

### 2. Create Service
```typescript
// src/services/example.service.ts
import { Example } from "../models/example.model.js";
import { NotFoundError } from "../errors/not-found.error.js";

export class ExampleService {
  async findById(id: number): Promise<Example> {
    const example = await Example.findOne({
      where: { id, deletedAt: null },
    });
    if (!example) {
      throw new NotFoundError(`Example with id ${id} not found`);
    }
    return example;
  }
}
```

### 3. Create Controller
```typescript
// src/controllers/example.controller.ts
import { catchAsync } from "../utils/catch-async.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";
import { errorCodes } from "../constants/constants.js";

class ExampleController {
  private exampleService = new ExampleService();

  findById = catchAsync(async (req, res, next) => {
    try {
      const example = await this.exampleService.findById(Number(req.params.id));
      handleSuccess(res, "success", example, errorCodes.resOk, req.lang);
    } catch (error) {
      next(error);
    }
  });
}

export default new ExampleController();
```

### 4. Create Validator
```typescript
// src/validators/example.validator.ts
import { z } from "zod";

export const exampleValidation = {
  create: {
    body: z.object({
      name: z.string().min(3).max(255),
      email: z.string().email(),
    }),
  },
};
```

### 5. Create Routes
```typescript
// src/routes/example.routes.ts
import { Router } from "express";
import exampleController from "../controllers/example.controller.js";
import { validateRequest } from "../middleware/validate-request.middleware.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { exampleValidation } from "../validators/example.validator.js";

const router = Router();

router.get("/:id", authenticateToken, exampleController.findById);

export default router;
```

### 6. Register Routes
```typescript
// src/routes/index.ts
import exampleRoutes from "./example.routes.js";

const routes = (app: Application) => {
  app.use("/api/examples", exampleRoutes);
};
```

### 7. Add Translations
```json
// src/locales/en.json
{
  "example_created": "Example created successfully"
}

// src/locales/it.json
{
  "example_created": "Esempio creato con successo"
}
```

## Common Patterns

### Error Handling
```typescript
// Always use catchAsync
const handler = catchAsync(async (req, res, next) => {
  // Your code
  if (error) {
    next(new AppError("Error message", StatusCode.BadRequest));
  }
});
```

### Success Response
```typescript
handleSuccess(
  res,
  "translation_key",
  data,
  errorCodes.resOk,
  req.lang
);
```

### Database Transactions
```typescript
const transaction = await sequelize.transaction();
try {
  // Your operations
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

### Soft Delete Check
```typescript
const record = await Model.findOne({
  where: {
    id,
    deletedAt: null, // Check for soft deletes
  },
});
```

## Environment Variables

Required in `.env`:
- `PORT` - Server port
- `NODE_ENV` - Environment
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `ALLOWED_ORIGINS` (comma-separated)
- `LOG_LEVEL`

## Testing the Setup

1. Start the server: `npm run dev`
2. Check health: `GET http://localhost:3000/health`
3. Test with language header: `X-Language: it`

