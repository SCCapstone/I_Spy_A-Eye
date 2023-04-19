describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp(); 
  });

  beforeEach(async () => {  // Reload React Native between tests for fresh state, and also login/reach search screen
    await device.reloadReactNative();
    await element(by.id('Test_SignInSkip')).longPress();
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

  /* Successfully exit the menu after pressing any of the sorting options */
  it('should remove the submenu after pressing lowest price sort', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(1000);
    await element(by.id('Test_SortLowestPriceButton')).longPress();
    await expect(element(by.id('Test_SortSubmenu'))).not.toExist();
  });

  it('should remove the submenu after pressing highest price sort', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(1000);
    await element(by.id('Test_SortHighestPriceButton')).longPress();
    await expect(element(by.id('Test_SortSubmenu'))).not.toExist();
  });

  it('should remove the submenu after pressing alphabetical sort', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(1000);
    await element(by.id('Test_SortA-ZButton')).longPress();
    await expect(element(by.id('Test_SortSubmenu'))).not.toExist();
  });

  it('should remove the submenu after pressing reverse alphabetical sort', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(1000);
    await element(by.id('Test_SortZ-AButton')).longPress();
    await expect(element(by.id('Test_SortSubmenu'))).not.toExist();
  });

  it('should remove the submenu after pressing unit price sort', async () => {
    await element(by.id('Test_SortButton')).longPress();
    await waitFor(element(by.id('Test_SortSubmenu'))).toExist().withTimeout(1000);
    await element(by.id('Test_SortUnitPriceButton')).longPress();
    await expect(element(by.id('Test_SortSubmenu'))).not.toExist();
  });
});