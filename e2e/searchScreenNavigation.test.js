describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp(); 
  });

  beforeEach(async () => {  // Reload React Native between tests for fresh state, and also login/reach search screen
    await device.reloadReactNative();
    await element(by.id('Test_SignInSkip')).longPress();
  });

  // Successfully trigger the prior page error from the initial screen
  it('should trigger the prior page alert when the previous page button is pressed on the default screen', async () => {
    await element(by.id('Test_PageBackButton')).longPress();
    await expect(element(by.text('No Prior Page'))).toBeVisible();
    await element(by.text('OK')).longPress();
  });

  // Successfully trigger the last page reached from the initial screen
  it('should trigger the last page alert when the previous page button is pressed on the default screen', async () => {
    await element(by.id('Test_PageForwardButton')).longPress();
    await expect(element(by.text('Last Page Reached'))).toBeVisible();
    await element(by.text('OK')).longPress();
  });
});