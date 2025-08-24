import { test, expect } from '@playwright/test';
import { LoanPage } from './pages/loan-page';
import { LoanDetailPage } from './pages/loandetail-page';

let loanPage: LoanPage;

test.beforeEach(async ({ page }) => {
  loanPage = new LoanPage(page);
  loanPage.openLoanPage();
});

test('Base elements are visible', async ({ page }) => {
  await expect.soft(loanPage.amountInput).toBeVisible();
  await expect.soft(loanPage.periodSelect).toBeVisible();
  await expect.soft(loanPage.applyButton).toBeVisible();
});

test('Get loan apply for 1000 euro and 24 mth', async ({ page }) => {
  await loanPage.amountInput.fill('1000');
  await loanPage.periodSelect.selectOption('24');
  await loanPage.monthlyAmountText.waitFor({ state: 'visible', timeout: 4000 });
  await loanPage.login();
  const loanDetailPage = new LoanDetailPage(page);
  const finalAmountText = await loanDetailPage.finalAmount.textContent();
  const finalMonthlyPaymentText =
      await loanDetailPage.finalMonthlyPayment.textContent();
  const finalPeriodText = await loanDetailPage.finalPeriod.textContent();
  expect.soft(finalAmountText).toBe('1000 €');
  expect.soft(finalMonthlyPaymentText).toBe('43.87 €');
  expect.soft(finalPeriodText).toBe('24 months');
});

test('Scroll and viewport visible elements', async ({ page }) => {
  await loanPage.applyLoanButton2.scrollIntoViewIfNeeded();
  await expect.soft(loanPage.applyLoanButton2).toBeInViewport();
});

test('Scroll range amount', async ({ page }) => {
  await loanPage.amountInputRange.fill('1900');
  await loanPage.setPeriodOption('24');
  await loanPage.monthlyAmountText.waitFor({ state: 'visible', timeout: 5000 });
  await loanPage.login();
  const loanResultPage = new LoanDetailPage(page);
  const loanMonthlyPaymentText =
      await loanResultPage.finalMonthlyPayment.textContent();
  expect.soft(loanMonthlyPaymentText).toBe('83.36 €');
});

test('Scroll Period option', async ({ page }) => {
  await loanPage.amountInputRange.fill('1900');
  await loanPage.periodSelectRange.fill('24');
  await loanPage.monthlyAmountText.waitFor({ state: 'visible', timeout: 5000 });
  await loanPage.login();
  const loanResultPage = new LoanDetailPage(page);
  const loanMonthlyPaymentText =
      await loanResultPage.finalMonthlyPayment.textContent();
  expect.soft(loanMonthlyPaymentText).toBe('83.36 €');
});

test('Return to the main page after successful loan count', async ({
                                                                     page,
                                                                   }) => {
  await loanPage.amountInput.fill('1000');
  await loanPage.periodSelect.selectOption('24');
  await loanPage.monthlyAmountText.waitFor({ state: 'visible', timeout: 4000 });
  await loanPage.login();
  const loanDetailPage = new LoanDetailPage(page);
  await loanDetailPage.continueButton2.click();
  await loanDetailPage.successOkButton.click();
  await loanPage.mainPageHeadingText.waitFor({
    state: 'visible',
    timeout: 5000,
  });
  await expect.soft(loanPage.mainPageHeadingText).toBeVisible();
});

test('By leaving Username and Password fields empty, continue button is not active', async ({
                                                                                              page,
                                                                                            }) => {
  await loanPage.amountInputRange.fill('1900');
  await loanPage.periodSelectRange.fill('24');
  await loanPage.applyButton.click();
  await loanPage.monthlyAmountText.waitFor({ state: 'visible', timeout: 4000 });
  await loanPage.usernameInput.fill('');
  await loanPage.passwordInput.fill('');
  await expect(loanPage.continueButton).toBeDisabled();
});

test('Minimum Amount slider set is 500, maximum Amount slider set is 10000', async ({
                                                                                      page,
                                                                                    }) => {
  await loanPage.amountInputRange.fill('500');
  await expect(loanPage.monthlyAmountText).toBeVisible();
  await loanPage.amountInputRange.fill('10000');
  await expect(loanPage.monthlyAmountText).toBeVisible();
});

test('Minimum Period slider set is 12, maximum Period slider set is 36', async ({
                                                                                  page,
                                                                                }) => {
  await loanPage.periodSelectRange.fill('12');
  await expect(loanPage.monthlyAmountText).toBeVisible();
  await loanPage.periodSelectRange.fill('36');
  await expect(loanPage.monthlyAmountText).toBeVisible();
});

test('By clicking on the second apply for loan button appears the main page with calculator', async ({
                                                                                                       page,
                                                                                                     }) => {
  await loanPage.applyLoanButton2.scrollIntoViewIfNeeded();
  await expect.soft(loanPage.applyLoanButton2).toBeInViewport();
  await loanPage.applyLoanButton2.click();
  await loanPage.mainPageHeadingText.waitFor({
    state: 'visible',
    timeout: 5000,
  });
  await expect.soft(loanPage.mainPageHeadingText).toBeVisible();
});

test('By clicking on the first apply for loan button appears the main page with calculator', async ({
                                                                                                      page,
                                                                                                    }) => {
  await loanPage.applyLoanButton1.scrollIntoViewIfNeeded();
  await expect.soft(loanPage.applyLoanButton1).toBeInViewport();
  await loanPage.applyLoanButton1.click();
  await loanPage.mainPageHeadingText.waitFor({
    state: 'visible',
    timeout: 5000,
  });
  await expect.soft(loanPage.mainPageHeadingText).toBeVisible();
});
test('Error message by providing an amount less than 500 Euro', async ({
                                                                         page,
                                                                       }) => {
  await loanPage.amountInput.fill('499');
  await loanPage.setPeriodOption('36');
  await expect.soft(loanPage.errorMessageBySmallAmount).toBeVisible();
  await expect.soft(loanPage.errorMessageBySmallAmount).toHaveText('Oops, something went wrong');
});