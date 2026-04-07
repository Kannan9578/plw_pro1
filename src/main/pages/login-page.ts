import {Page} from "@playwright/test";
import { BasePage } from "./base-page.js";
export class LoginPage extends BasePage
{


    constructor(page: Page)
    {
        super(page)
    }

    async navigateTo(url?: string) {

        const baseUrl = url!==undefined ? url : 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';;
        await this.page.goto(baseUrl);
        await this.page.waitForLoadState("load",{timeout: 12000});
    }

    async login(username?: string, password?: string) {
        if(username !== undefined ){
        await this.enterUsername(username);
        }
        if(password !== undefined ){                                        
        await this.enterPassword(password);
        }
        await this.clickLoginButton();
        
    }

    async enterUsername(username: string) {
        await this.page.getByPlaceholder('Username').fill(username);
    }   
    async enterPassword(password: string) {
        await this.page.getByPlaceholder('Password').fill(password);
    }

    async clickLoginButton() {
        await this.page.getByRole('button', { name: 'Login' }).click();
        await this.page.waitForLoadState("networkidle");
    }

    async getErrorMessage() {
        const errorMessage = await this.page.locator('.oxd-alert-content-text').textContent();
        return errorMessage ? errorMessage.trim() : '';
    }

     async getInputFieldErrorMessages() {
        const errorMessages = await this.page.locator('[class*="input-field-error"]').allTextContents();
        return errorMessages.map(msg => msg.trim());
    }   

}