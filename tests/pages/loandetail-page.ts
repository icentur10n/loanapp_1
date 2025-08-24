import type { Locator, Page } from '@playwright/test';

export class LoanDetailPage {
    readonly page: Page;
    readonly finalAmount: Locator;
    readonly finalPeriod: Locator;
    readonly finalMonthlyPayment: Locator;
    readonly continueButton2: Locator;
    readonly successOkButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.finalAmount = page.getByTestId('final-page-amount');
        this.finalPeriod = page.getByTestId('final-page-period');
        this.finalMonthlyPayment = page.getByTestId('final-page-monthly-payment');
        this.continueButton2 = page.getByTestId('final-page-continue-button');
        this.successOkButton = page.getByTestId('final-page-success-ok-button');
    }
}