# Prisma Migration Commands

## Prerequisites

1. **Ensure `.env` file exists** with `DATABASE_URL`:
   ```env
   DATABASE_URL="mysql://root@localhost:3306/your_database_name"
   ```
   Or with password:
   ```env
   DATABASE_URL="mysql://root:yourpassword@localhost:3306/your_database_name"
   ```

2. **Create the database** in phpMyAdmin or MySQL:
   - Database name should match the one in `DATABASE_URL`
   - Collation: `utf8mb4_unicode_ci` (recommended)

## Step-by-Step Commands

### 1. Generate Prisma Client
Generate the Prisma Client based on your schema:
```bash
npx prisma generate
```

**What it does:**
- Reads `prisma/schema.prisma`
- Generates TypeScript types and client code
- Creates files in `node_modules/.prisma/client`

### 2. Create Initial Migration
Create your first migration from the schema:
```bash
npx prisma migrate dev --name init
```

**What it does:**
- Creates a new migration in `prisma/migrations/`
- Applies the migration to your database
- Creates all tables defined in your schema
- Generates Prisma Client automatically

**Alternative (if you want to customize migration name):**
```bash
npx prisma migrate dev --name create_initial_tables
```

### 3. Apply Migrations (Production)
For production or if migrations already exist:
```bash
npx prisma migrate deploy
```

**What it does:**
- Applies all pending migrations
- Does NOT generate Prisma Client (use `prisma generate` separately)
- Safe for production use

### 4. View Migration Status
Check which migrations have been applied:
```bash
npx prisma migrate status
```

### 5. Reset Database (Development Only)
⚠️ **WARNING**: This will delete all data!
```bash
npx prisma migrate reset
```

**What it does:**
- Drops the database
- Recreates it
- Applies all migrations
- Runs seed scripts (if configured)

## Complete Setup Workflow

### First Time Setup:
```bash
# 1. Ensure DATABASE_URL is set in .env
# 2. Create database in phpMyAdmin/MySQL

# 3. Generate Prisma Client
npx prisma generate

# 4. Create and apply initial migration
npx prisma migrate dev --name init

# 5. Verify tables were created
npx prisma studio
```

### After Schema Changes:
```bash
# 1. Update prisma/schema.prisma

# 2. Create new migration
npx prisma migrate dev --name describe_your_changes

# 3. Migration is automatically applied in dev mode
```

## Tables That Will Be Created

Based on your Prisma schema, the following tables will be created:

1. **`user`** - User accounts
   - Primary key: `id` (BigInt, auto-increment)
   - Fields: countryCode, phoneNumber, fullName, Gender, isBusinessUser, isActive, emailID, rideOTP, isVerified, referalCode, referedBy
   - Timestamps: created_at, updated_at, deleted_at

2. **`user_session`** - User session tokens
   - Primary key: `id` (BigInt, auto-increment)
   - Fields: user_id, fcm_token, token
   - Timestamps: created_at, updated_at, deleted_at

3. **`otp_data`** - OTP verification data
   - Primary key: `id` (BigInt, auto-increment)
   - Fields: user_id, otp_value
   - Timestamps: created_at, updated_at, deleted_at

4. **`temp_phone`** - Temporary phone verification
   - Primary key: `user_id` (BigInt)
   - Fields: ph_no, otp
   - Timestamps: created_at, updated_at, deleted_at

## Additional Useful Commands

### View Database in Browser (Prisma Studio)
```bash
npx prisma studio
```
Opens a visual database browser at `http://localhost:5555`

### Format Prisma Schema
```bash
npx prisma format
```

### Validate Prisma Schema
```bash
npx prisma validate
```

### Introspect Existing Database
If you have an existing database and want to generate Prisma schema from it:
```bash
npx prisma db pull
```

### Push Schema Changes (Development Only)
Directly push schema changes without creating migrations (not recommended for production):
```bash
npx prisma db push
```

## Troubleshooting

### Error: "Can't reach database server"
- Verify MySQL server is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

### Error: "Migration failed"
- Check database connection
- Verify schema syntax: `npx prisma validate`
- Check for existing tables that conflict

### Error: "Table already exists"
- Use `npx prisma migrate reset` (⚠️ deletes all data)
- Or manually drop tables in phpMyAdmin
- Or use `npx prisma db push` for development

### View SQL Migration Files
Migrations are stored in `prisma/migrations/` directory. Each migration contains:
- `migration.sql` - The SQL statements
- `migration_lock.toml` - Migration metadata

## Production Deployment

For production, use:
```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Apply migrations (doesn't generate client)
npx prisma migrate deploy
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Create & apply migration (dev) |
| `npx prisma migrate deploy` | Apply migrations (production) |
| `npx prisma migrate status` | Check migration status |
| `npx prisma studio` | Open database browser |
| `npx prisma db push` | Push schema directly (dev only) |
| `npx prisma migrate reset` | Reset database (dev only) |

