import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(productSlug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${productSlug}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
