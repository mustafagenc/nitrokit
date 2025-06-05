-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_account_security" BOOLEAN NOT NULL DEFAULT true,
    "email_login_alerts" BOOLEAN NOT NULL DEFAULT true,
    "email_password_changes" BOOLEAN NOT NULL DEFAULT true,
    "email_profile_updates" BOOLEAN NOT NULL DEFAULT true,
    "email_marketing" BOOLEAN NOT NULL DEFAULT false,
    "email_newsletters" BOOLEAN NOT NULL DEFAULT false,
    "sms_account_security" BOOLEAN NOT NULL DEFAULT true,
    "sms_login_alerts" BOOLEAN NOT NULL DEFAULT true,
    "sms_password_changes" BOOLEAN NOT NULL DEFAULT false,
    "sms_profile_updates" BOOLEAN NOT NULL DEFAULT false,
    "sms_marketing" BOOLEAN NOT NULL DEFAULT false,
    "app_account_security" BOOLEAN NOT NULL DEFAULT true,
    "app_login_alerts" BOOLEAN NOT NULL DEFAULT true,
    "app_password_changes" BOOLEAN NOT NULL DEFAULT true,
    "app_profile_updates" BOOLEAN NOT NULL DEFAULT true,
    "app_system_updates" BOOLEAN NOT NULL DEFAULT true,
    "app_marketing" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
