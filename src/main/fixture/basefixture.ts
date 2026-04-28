import {test as baseTest,expect} from '@playwright/test'
import { LoginPage } from '../pages/login-page.js'
import { HomePage } from '../pages/home-page.js'
import { DBUtils } from '../utils/dbutils.js'

// Define a custom fixture that includes the LoginPage and HomePage 
type myFixture={
    loginPage:LoginPage,
    homePage:HomePage
    dbUtils:DBUtils
}

// Extend the base test with our custom fixture
export const test = baseTest.extend<myFixture>(
    {
        loginPage: async ({page},use)=>{await use(new LoginPage(page))},
        homePage: async ({page},use)=>{await use(new HomePage(page))},
        dbUtils: async ({},use)=>{await use(new DBUtils())}
    }
);

export {expect};