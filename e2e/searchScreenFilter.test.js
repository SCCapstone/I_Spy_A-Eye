describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp(); 
  });

  beforeEach(async () => {  // Reload React Native between tests for fresh state, and also login/reach search screen
    await device.reloadReactNative();
    await element(by.id('Test_SignInSkip')).longPress();
  });

  // Successfully load the filtering submenu and respective touchable opacity
  it('should load the filter submenu when the filter button is pressed', async () => {
    await element(by.id('Test_FilterButton')).longPress();
    await expect(element(by.id('Test_FilterCountryButton'))).toBeVisible()
    await expect(element(by.id('Test_FilterInStockButton'))).toBeVisible();
    await expect(element(by.id('Test_FilterOnSaleButton'))).toBeVisible();
    await expect(element(by.id('Test_FilterCategoryButton'))).toBeVisible();
  });

  // Successfully exit the menu after tapping outside of its area
  it('should remove the filter submenu after tapping outside it', async () => {
    await element(by.id('Test_FilterButton')).longPress();
    await element(by.id('Test_FilterSubmenuOpacity')).longPress();
    await expect(element(by.id('Test_FilterSubmenuModal'))).not.toBeVisible();
  });

  // Successfully load the country submenu
  it('should load the country filter submenu when the country filter button is pressed', async () => {
    await element(by.id('Test_FilterButton')).longPress();
    await element(by.id('Test_FilterCountryButton')).longPress();
    await expect(element(by.id('Test_FilterCountrySubmenu'))).toExist();
  });
  
  // Successfully exit the country submenu after tapping outside of its area to reach the original filter submenu
  it('should remove the filter submenu after tapping outside it', async () => {
    await element(by.id('Test_FilterButton')).longPress();
    await element(by.id('Test_FilterCountryButton')).longPress();
    await element(by.id('Test_FilterCountrySubmenuOpacity')).longPress();
    await expect(element(by.id('Test_FilterCountrySubmenuModal'))).not.toExist();
    await expect(element(by.id('Test_FilterCountryButton'))).toExist();
  });

  
  // Successfully load the category submenu
  it('should load the category filter submenu when the category filter button is pressed', async () => {
    await element(by.id('Test_FilterButton')).longPress();
    await element(by.id('Test_FilterCategoryButton')).longPress();
    await expect(element(by.id('Test_FilterCategorySubmenu'))).toExist();
  });
  
  // Successfully exit the category submenu after tapping outside of its area to reach the original filter submenu
  it('should remove the category filter submenu after tapping outside it', async () => {
    await element(by.id('Test_FilterButton')).longPress();
    await element(by.id('Test_FilterCategoryButton')).longPress();
    await element(by.id('Test_FilterCategorySubmenuOpacity')).longPress();
    await expect(element(by.id('Test_FilterCategorySubmenuModal'))).not.toExist();
    await expect(element(by.id('Test_FilterCategoryButton'))).toExist();
  });

});