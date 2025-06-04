/*
  Warnings:

  - The values [PHONE_VERIFIED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('PROFILE_UPDATED', 'PASSWORD_CHANGED', 'AVATAR_UPDATED', 'AVATAR_REMOVED', 'SUPPORT_MESSAGE', 'INVOICE_CREATED', 'INVOICE_PAID', 'SYSTEM_ALERT', 'PHONE_VERIFIED');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
