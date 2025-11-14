# MySQL Database Setup Guide

This guide will help you configure MySQL database connection for local phpMyAdmin installation.

## Prerequisites

- MySQL server running locally (via XAMPP, WAMP, MAMP, or standalone MySQL)
- phpMyAdmin accessible at `http://localhost/phpmyadmin`
- Node.js and npm installed

## Database Connection Configuration

### 1. Create `.env` File

Create a `.env` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=development

# MySQL Database Configuration (for local phpMyAdmin)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=root
DB_PASSWORD=

# Prisma Database URL (for Prisma Client)
# Format: mysql://username:password@host:port/database_name
# If password is empty, use: mysql://root@localhost:3306/your_database_name
DATABASE_URL="mysql://root@localhost:3306/your_database_name"

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
```

### 2. Common Local MySQL Settings

For typical local phpMyAdmin installations:

| Setting | Default Value | Description |
|---------|--------------|-------------|
| `DB_HOST` | `localhost` or `127.0.0.1` | MySQL server host |
| `DB_PORT` | `3306` | MySQL server port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | (empty) or your password | MySQL password |
| `DB_NAME` | Your database name | Database name created in phpMyAdmin |

### 3. Setting Up the Database

1. **Open phpMyAdmin**: Navigate to `http://localhost/phpmyadmin`

2. **Create a new database**:
   - Click on "New" in the left sidebar
   - Enter your database name (e.g., `hyr_customer_db`)
   - Select collation: `utf8mb4_unicode_ci` (recommended)
   - Click "Create"

3. **Update `.env` file**:
   - Replace `your_database_name` with your actual database name
   - Update `DB_PASSWORD` if you have set a password for MySQL root user

4. **For Prisma DATABASE_URL**:
   - If password is empty: `mysql://root@localhost:3306/your_database_name`
   - If password exists: `mysql://root:yourpassword@localhost:3306/your_database_name`

### 4. Test Database Connection

The application will automatically test the database connection on startup. You can also test it manually:

```typescript
import { testDatabaseConnection } from './src/utils/db-connection.js';

testDatabaseConnection()
  .then(() => console.log('Database connected successfully!'))
  .catch((error) => console.error('Database connection failed:', error));
```

## Connection Features

The MySQL connector includes:

- **Connection Pooling**: Optimized connection management
  - Development: Max 5 connections
  - Production: Max 10 connections
- **Timeout Handling**: 60-second connection timeout
- **Error Handling**: Comprehensive error logging
- **SSL Support**: Configured for production environments

## Troubleshooting

### Connection Refused Error

- Verify MySQL server is running
- Check if port 3306 is correct (some installations use different ports)
- Ensure MySQL service is started

### Access Denied Error

- Verify username and password in `.env`
- Check MySQL user permissions
- Try resetting MySQL root password if needed

### Database Not Found Error

- Ensure database exists in phpMyAdmin
- Verify database name in `.env` matches exactly
- Check for typos in database name

### Prisma Connection Issues

- Verify `DATABASE_URL` format is correct
- Ensure Prisma schema is using MySQL provider
- Run `npx prisma generate` after updating DATABASE_URL

## Example `.env` File

```env
NODE_ENV=development

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hyr_customer_db
DB_USER=root
DB_PASSWORD=

# Prisma URL (no password)
DATABASE_URL="mysql://root@localhost:3306/hyr_customer_db"

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=3000
```

## Next Steps

After setting up the database:

1. Run Prisma migrations (if using Prisma):
   ```bash
   npx prisma migrate dev
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

The database connection will be established automatically when the application starts.

