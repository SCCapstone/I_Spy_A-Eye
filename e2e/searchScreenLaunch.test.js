describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp(); 
  });

  beforeEach(async () => {  // Reload React Native between tests for fresh state
    await device.reloadReactNative();
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
});