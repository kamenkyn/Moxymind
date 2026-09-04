import { Page, Locator, expect } from '@playwright/test';

export const BACKPACK_IMAGE_SRC = '/assets/sauce-backpack-1200x1500-CjRW-Djj.jpg';
export const BIKE_LIGHT_IMAGE_SRC = '/assets/bike-light-1200x1500-DxcZRFOA.jpg';
export const BOLT_SHIRT_IMAGE_SRC = '/assets/bolt-shirt-1200x1500-mR0ldpVS.jpg';
export const PULOVER_IMAGE_SRC = '/assets/sauce-pullover-1200x1500-BfbI-PSd.jpg';
export const RED_ONESIE_IMAGE_SRC = '/assets/red-onesie-1200x1500-BrSuq0ic.jpg';
export const RED_TSHIRT_IMAGE_SRC = '/assets/red-tatt-1200x1500-E-qp6aYf.jpg';
export const PROBLEM_IMAGE_SRC = '/assets/sl-404-Cq1a9k9X.jpg';

const INVENTORY_IMAGES = '[data-test$="-img"]';

export class ProductPage {
  readonly page: Page;
  readonly inventoryImages: Locator;
  readonly backpackImage: Locator;
  readonly addBackpackButton: Locator;
  readonly removeBackpackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryImages = page.locator(INVENTORY_IMAGES);
    this.backpackImage = page.locator('[data-test="inventory-item-sauce-labs-backpack-img"]');
    this.addBackpackButton = page.locator('#add-to-cart-sauce-labs-backpack');
    this.removeBackpackButton = page.locator('#remove-sauce-labs-backpack');
  }

  async checkImages() {
    await expect(this.page.locator('#item_4_img_link img')).toHaveAttribute(
      'src',BACKPACK_IMAGE_SRC);
    await expect(this.page.locator('#item_0_img_link img')).toHaveAttribute(
      'src',BIKE_LIGHT_IMAGE_SRC);
    await expect(this.page.locator('#item_1_img_link img')).toHaveAttribute(
      'src',BOLT_SHIRT_IMAGE_SRC);
    await expect(this.page.locator('#item_5_img_link img')).toHaveAttribute(
      'src',PULOVER_IMAGE_SRC);
    await expect(this.page.locator('#item_2_img_link img')).toHaveAttribute(
      'src',RED_ONESIE_IMAGE_SRC);
    await expect(this.page.locator('#item_3_img_link img')).toHaveAttribute(
      'src',RED_TSHIRT_IMAGE_SRC);
  }

  async addAndRemoveBackpack() {
    await this.addBackpackButton.click();
    await expect(this.removeBackpackButton).toBeVisible();
    await this.removeBackpackButton.click();
    await expect(this.addBackpackButton).toBeVisible();
  }
}
