# Fix Migration Error - Step by Step

## Problem
MySQL error: "Invalid default value for 'updated_at'" 
- This happens because MySQL TIMESTAMP has strict rules about default values
- Solution: Changed schema to use `DATETIME` instead of `TIMESTAMP`

## Steps to Fix

### Step 1: Resolve the Failed Migration
Mark the failed migration as rolled back:
```powershell
npx prisma migrate resolve --rolled-back 20251114062959_init
```

### Step 2: Delete the Failed Migration (Optional but Recommended)
Delete the failed migration folder:
```powershell
Remove-Item -Recurse -Force prisma\migrations\20251114062959_init
```

### Step 3: Create New Migration with Fixed Schema
The schema has been updated to use `DATETIME` instead of `TIMESTAMP`. Create a new migration:
```powershell
npx prisma migrate dev --name init_fixed
```

This will:
- Generate a new migration with DATETIME columns
- Apply it to your database
- Create all tables successfully

## Alternative: Manual Database Cleanup

If the above doesn't work, you can manually clean up:

### Option A: Reset Everything (⚠️ Deletes all data)
```powershell
npx prisma migrate reset
```

### Option B: Manual SQL Cleanup
1. Open phpMyAdmin
2. Select your database
3. Run this SQL to drop any partially created tables:
```sql
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `user_session`;
DROP TABLE IF EXISTS `otp_data`;
DROP TABLE IF EXISTS `temp_phone`;
```
4. Then run:
```powershell
npx prisma migrate dev --name init_fixed
```

## What Changed in Schema

All timestamp fields changed from:
- `@db.Timestamp` → `@db.DateTime(0)`

This provides:
- ✅ Better MySQL compatibility
- ✅ No strict default value issues
- ✅ Same functionality (automatic timestamps)

## Verify Success

After migration succeeds, verify tables:
```powershell
npx prisma studio
```

Or check in phpMyAdmin that all 4 tables exist with correct structure.

