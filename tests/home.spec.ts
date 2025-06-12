import { test, expect } from '@playwright/test';

test('ana sayfa başlığını kontrol et', async ({ page }) => {
    await page.goto('/');

    // Sayfa başlığının doğru olduğunu kontrol et
    await expect(page).toHaveTitle(/Nitrokit Starter Template/);
});

test('sayfa yüklendiğinde temel elementlerin varlığını kontrol et', async ({ page }) => {
    await page.goto('/');

    // Header'ın görünür olduğunu kontrol et
    await expect(page.locator('header')).toBeVisible();

    // Footer'ın görünür olduğunu kontrol et
    await expect(page.locator('footer')).toBeVisible();
});

test('sayfa yüklendiğinde hata olmadığını kontrol et', async ({ page }) => {
    // Konsol hatalarını yakala
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    await page.goto('/');

    // Konsol hatalarının olmadığını kontrol et
    expect(consoleErrors).toHaveLength(0);
});
