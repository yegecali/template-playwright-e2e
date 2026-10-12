import { test, expect } from '../src/fixtures';
import { products } from '../src/data/products';

test.describe('Checkout', () => {
  test('compra un producto de punta a punta', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutInfo,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(1);
    await cartPage.checkout();

    await checkoutPage.fillShippingInfo(checkoutInfo);
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
