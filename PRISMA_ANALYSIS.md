# Prisma Database Analysis & Migration Guide

## Codebase Analysis

### Current Database Setup

**Dual ORM Setup:**
- **Sequelize**: Currently used for all database operations in the codebase
- **Prisma**: Schema exists but not actively used in code (only installed as dependency)

### Database Models Comparison

#### 1. **User Model**
- **Sequelize**: `src/models/user.model.ts`
- **Prisma**: `prisma/schema.prisma` - `User` model
- **Status**: ✅ Schema matches

**Fields:**
- `id` (BigInt, auto-increment, primary key)
- `countryCode` (String(5))
- `phoneNumber` (String(20))
- `fullName` (String(125))
- `Gender` (SmallInt)
- `isBusinessUser` (TinyInt)
- `isActive` (TinyInt)
- `emailID` (String(125))
- `rideOTP` (String(4))
- `isVerified` (TinyInt)
- `referalCode` (String(20), nullable)
- `referedBy` (BigInt, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps with soft delete)

#### 2. **User_session Model**
- **Sequelize**: `src/models/user-session.model.ts`
- **Prisma**: `prisma/schema.prisma` - `User_session` model
- **Status**: ✅ Schema matches

**Fields:**
- `id` (BigInt, auto-increment, primary key)
- `user_id` (BigInt)
- `fcm_token` (String(255))
- `token` (String(755))
- `created_at`, `updated_at`, `deleted_at` (timestamps with soft delete)

#### 3. **Otp_data Model**
- **Sequelize**: `src/models/otp-data.model.ts`
- **Prisma**: `prisma/schema.prisma` - `Otp_data` model
- **Status**: ✅ Schema matches

**Fields:**
- `id` (BigInt, auto-increment, primary key)
- `user_id` (BigInt)
- `otp_value` (String(6))
- `created_at`, `updated_at`, `deleted_at` (timestamps with soft delete)

#### 4. **Temp_phone Model**
- **Sequelize**: `src/models/temp-phone.model.ts`
- **Prisma**: `prisma/schema.prisma` - `Temp_phone` model
- **Status**: ⚠️ **ISSUE FOUND** - Missing timestamps in Prisma schema

**Current Prisma Schema:**
- `user_id` (BigInt, primary key) ✅
- `ph_no` (String(20)) ✅
- `otp` (String(6)) ✅
- **Missing**: `created_at`, `updated_at`, `deleted_at`

**Sequelize Model Has:**
- Timestamps enabled (created_at, updated_at)
- Soft delete support (deleted_at)

### Database Connection

**Sequelize Connection:**
- File: `src/db/config.ts`
- Uses environment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Connection pooling configured
- Logging enabled for development

**Prisma Connection:**
- File: `prisma/schema.prisma`
- Uses environment variable: `DATABASE_URL`
- Format: `mysql://username:password@host:port/database_name`

## Issues Found

1. **Temp_phone Model Missing Timestamps**: The Prisma schema for `Temp_phone` doesn't include `created_at`, `updated_at`, and `deleted_at` fields that exist in the Sequelize model.

2. **Prisma Not Used in Codebase**: Prisma client is installed but not imported or used anywhere in the source code.

## Recommendations

1. **Fix Prisma Schema**: Add timestamps to `Temp_phone` model to match Sequelize
2. **Choose One ORM**: Decide whether to use Sequelize or Prisma (or both for different purposes)
3. **Sync Schemas**: Ensure both ORMs have matching schemas if using both

