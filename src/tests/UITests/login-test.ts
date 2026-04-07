import { test, expect } from '../../main/fixture/basefixture.js';
import { ENV } from '../../main/utils/env.js';

test.describe("Login Test", () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo(ENV.BASE_URL);
  });


  //Positive test case for login with valid credentials

  test('Verify successfull Login with valid user and password', async ({ page, loginPage }) => {
    await loginPage.login(ENV.USERNAME, ENV.PASSWORD);
    const profilePicture = page.locator('h6');
    await expect(profilePicture).toHaveText('Dashboard');
  });

  //Negative test cases for login with invalid credentials
  test('Verify that the user receives an error when entering an invalid username and valid password.', async ({ page, loginPage }) => {
    await loginPage.login(ENV.INVALID_USERNAME, ENV.PASSWORD);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toEqual('Invalid credentials')

  })

  test('Verify that the user receives an error when entering an valid username and invalid password.', async ({ page, loginPage }) => {
    await loginPage.login(ENV.USERNAME, ENV.INVALID_PASSWORD);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toEqual('Invalid credentials')

  })

  test('Verify that the user receives an error when entering an invalid username and invalid password.', async ({ page, loginPage }) => {
    await loginPage.login(ENV.INVALID_USERNAME, ENV.INVALID_PASSWORD);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toEqual('Invalid credentials');
  })

  test('Verify that an error occurs when the user enters only the username and tries to log in', async ({ page, loginPage }) => {
    await loginPage.login(ENV.USERNAME);
    const errorMessage = await loginPage.getInputFieldErrorMessages();
    expect(errorMessage[0]).toEqual('Required');
  })

  test('Verify that an error occurs when the user enters only the password and tries to log in.', async ({ page, loginPage }) => {
    await loginPage.login(ENV.PASSWORD);
    const errorMessage = await loginPage.getInputFieldErrorMessages();
    expect(errorMessage[0]).toEqual('Required');
  })

  test('Verify error is shown when login attempted with empty username and password', async ({ page, loginPage }) => {
    await loginPage.login();
    const errorMessage = await loginPage.getInputFieldErrorMessages();
    expect(errorMessage).toHaveLength(2);
  })


})



