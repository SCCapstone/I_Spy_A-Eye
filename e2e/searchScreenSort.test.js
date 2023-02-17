describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp(); 
  });

  beforeEach(async () => {  // Reload React Native between tests for fresh state, and also login/reach search screen
    await device.reloadReactNative();
    await element(by.id('Test_EmailTextBar')).longPress();
    await element(by.id('Test_EmailTextBar')).typeText('123cookie@yopmail.com\n');
    await element(by.id('Test_PasswordTextBar')).longPress();
    await element(by.id('Test_PasswordTextBar')).longPress();
    await element(by.id('Test_PasswordTextBar')).typeText('123cookie\n');
    await element(by.id('Test_LogInButton')).longPress();
    await element(by.id('Test_LogInButton')).longPress();
    await waitFor(element(by.text('OK'))).toExist().withTimeout(5000);
    await element(by.text('OK')).longPress();
  });

  // Successfully load the sorting submenu and respective touchable opacity
  it('should load the sorting submenu when the sort button is pressed', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(2000);
    await expect(element(by.id('Test_SortSubmenu'))).toExist()
    await expect(element(by.id('Test_SortLowestPriceButton'))).toExist();
    await expect(element(by.id('Test_SortHighestPriceButton'))).toExist();
    await expect(element(by.id('Test_SortA-ZButton'))).toExist();
    await expect(element(by.id('Test_SortZ-AButton'))).toExist();
    await expect(element(by.id('Test_SortUnitPriceButton'))).toExist();
  });

  // Successfully exit the menu after tapping outside of its area
  it('should remove the submenu after tapping outside it', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(2000);
    await element(by.id('Test_SortSubmenuOpacity')).longPress();
    await expect(element(by.id('Test_SortSubmenu'))).not.toExist();
  });
});