-- CreateTable
CREATE TABLE `temp_phone` (
    `user_id` BIGINT NOT NULL,
    `ph_no` VARCHAR(20) NOT NULL,
    `otp` VARCHAR(6) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_session` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `fcm_token` VARCHAR(255) NOT NULL,
    `token` VARCHAR(755) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_data` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `otp_value` VARCHAR(6) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `countryCode` VARCHAR(5) NOT NULL,
    `phoneNumber` VARCHAR(20) NOT NULL,
    `fullName` VARCHAR(125) NOT NULL,
    `Gender` SMALLINT NOT NULL,
    `isBusinessUser` TINYINT NOT NULL,
    `isActive` TINYINT NOT NULL,
    `emailID` VARCHAR(125) NOT NULL,
    `rideOTP` VARCHAR(4) NOT NULL,
    `isVerified` TINYINT NOT NULL,
    `referalCode` VARCHAR(20) NULL,
    `referedBy` BIGINT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
