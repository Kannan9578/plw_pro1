import { Page } from "@playwright/test";

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForElement(selector: string, timeout: number = 5000) {
        await this.page.waitForSelector(selector, { state: 'visible', timeout });
    }   
}