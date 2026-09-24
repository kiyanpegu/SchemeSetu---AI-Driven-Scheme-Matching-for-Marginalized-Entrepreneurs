import { test, expect } from '@playwright/test';

test.describe('SchemeSetu Critical User Journeys', () => {

  test.beforeEach(async ({ page }) => {
    // Inject sessionStorage before page loads to completely bypass the language modal
    await page.addInitScript(() => {
      window.sessionStorage.setItem('schemeSetuLang', 'en');
    });
  });

  test('CUJ 1: Find Scheme Wizard (End-to-End)', async ({ page }) => {
    await page.goto('/');

    // Navigate to Find Scheme via the CTA button
    await page.getByRole('link', { name: 'Find Scheme' }).first().click();

    // Verify step 1: Purpose
    await expect(page.getByText('Start Business').first()).toBeVisible();
    await page.getByText('Start Business').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 2: Age & Gender
    await expect(page.getByText('Female').first()).toBeVisible();
    await page.getByText('Female').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 3: Location
    await expect(page.getByText('Rural').first()).toBeVisible();
    await page.getByText('Rural').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 4: Amount
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 5: Income
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 6: Education
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify step 7: Documents (Caste Certificate)
    const yesButton = page.getByRole('button', { name: 'Yes' });
    if (await yesButton.count() > 0) {
        await yesButton.first().click();
    }
    
    await page.getByRole('button', { name: /Find Matches/i }).click();

    // Verify Results Page
    await expect(page).toHaveURL(/results/);
    await expect(page.getByText(/Matches|Schemes/i).first()).toBeVisible();
  });

  test('CUJ 2: EMI Calculator Workflow', async ({ page }) => {
    await page.goto('/calculator');
    
    await expect(page.getByText(/EMI Calculator/i).first()).toBeVisible();
    await expect(page.getByText(/Monthly EMI/i).first()).toBeVisible();

    // Interact with the loan amount slider
    const slider = page.locator('input[type="range"]').first();
    await slider.fill('500000');
    
    await expect(page.getByText(/Monthly EMI/i).first()).toBeVisible();
  });

  test('CUJ 3: Explore Schemes Navigation', async ({ page }) => {
    await page.goto('/explore');

    await expect(page.getByText(/Explore Government Schemes/i).first()).toBeVisible();

    // Click on the first scheme card to view details
    const firstScheme = page.locator('a[href^="/scheme/"]').first();
    await firstScheme.click();

    // Verify we navigated to the Scheme Details page
    await expect(page).toHaveURL(/\/scheme\/.+/);
    
    // Open the application dossier
    const dossierBtn = page.getByRole('button', { name: /Application Dossier/i }).first();
    await expect(dossierBtn).toBeVisible();
    await dossierBtn.click();
    
    // Verify the modal opens by looking for "Print / Save PDF"
    await expect(page.getByRole('button', { name: /Print/i }).first()).toBeVisible();
  });

  test('CUJ 4: Partner Search', async ({ page }) => {
    await page.goto('/partners');
    
    // Fallback search to check if page rendered properly
    await expect(page.getByPlaceholder(/Search/i)).toBeVisible();

    const searchInput = page.getByPlaceholder(/Search/i);
    await searchInput.fill('Delhi');
    
    // Check if the results update (some card should be visible)
    await expect(page.locator('.grid > div').first()).toBeVisible();
  });

});

