describe("Example", () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    // Reload react native, login and reach cart screen
    beforeEach(async () => {
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
        await element(by.id("cart_navigation")).longPress();
      });

    // test if the cart header elements load correctly
    it("should load button and text in the cart header when cart is launched", async () => {
        await expect(element(by.id("test_CartTextHeader"))).toBeVisible();
        await expect(element(by.id("test_GroceryTextHeader"))).toBeVisible();
        await expect(element(by.id("test_DeliveryTextHeader"))).toBeVisible();
        await expect(element(by.id("test_BuyButtonHeader"))).toBeVisible();
        await expect(element(by.id("test_GrandTotalHeader"))).toBeVisible();
    });

    // test if the items in the cart are loaded
    it("should load the items in the cart", async () => {
        await expect(element(by.id("test_ItemsInCart"))).toBeVisible();
    })
});