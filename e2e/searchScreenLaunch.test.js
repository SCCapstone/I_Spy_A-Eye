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

  // Successfully load each search header element
  it('should load every button/textinput in the search header on search screen launch', async () => {
    await expect(element(by.id('Test_SearchTextHeader'))).toBeVisible();
    await expect(element(by.id('Test_SearchButton'))).toBeVisible();
    await expect(element(by.id('Test_FilterButton'))).toBeVisible();
    await expect(element(by.id('Test_SortButton'))).toBeVisible();
    await expect(element(by.id('Test_ScanButton'))).toBeVisible();
    
  });

  // Successfully load the navigation bar
  it('should load the navigation bar on search screen launch', async () => {
    await expect(element(by.id('Test_NavigationBar'))).toBeVisible();
  });

  // Successfully tap search with empty bar and get error message
  it('should tap search with empty bar and get error message', async () => {
    await element(by.id('Test_SearchButton')).longPress();
    await expect(element(by.text('Invalid Input'))).toExist();
  });
});