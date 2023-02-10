describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp(); 
  });

  beforeEach(async () => {  // Reload React Native between tests for fresh state
    await device.reloadReactNative();
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