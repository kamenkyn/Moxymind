import { expect, test } from '@playwright/test';
import { USERS, PASSWORD } from '../enums/users';
import { LoginPage } from '../pages/loginPage';
import { BACKPACK_IMAGE_SRC, PROBLEM_IMAGE_SRC, ProductPage } from '../pages/productPage';

const standardPrices = [29.99, 9.99, 15.99, 49.99, 7.99, 15.99];

async function loginAs(page: import('@playwright/test').Page, username: string) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(username, PASSWORD);
  await login.expectLoggedIn();
}

async function logout(page: import('@playwright/test').Page) {
  try {
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
  } catch (err) {
  }
}

//standard user should see the expected backpack image and be able to add and remove it from the cart
//check if the prices for all products are as expected for standard_user 
test('standard_user show the expected backpack image', async ({ page }) => {
  await loginAs(page, USERS.STANDARD);
  const product = new ProductPage(page);
  await product.checkImages();

  const prices = await product.page
    .locator('[data-test="inventory-item-price"]')
    .evaluateAll((priceElements) =>
      priceElements.map((price) => Number(price.textContent?.replace('$', ''))),
    );
  expect(prices).toEqual(standardPrices);

  await product.addAndRemoveBackpack();
  await logout(page); 
});

//error_user should see the expected backpack image and be able to add and not be able to remove it from the cart
test('error_user show the expected backpack image', async ({ page }) => {
  await loginAs(page, USERS.ERROR);
  const product = new ProductPage(page);
  await product.checkImages();
  await product.addBackpackButton.click();
  const [error] = await Promise.all([
    product.page.waitForEvent('pageerror'),
    product.removeBackpackButton.click(),
  ]);
  expect(error.message).toContain('Failed to remove item from cart.');
  await expect(product.removeBackpackButton).toBeVisible();
  await logout(page); 
});

//visual_user should see a different first backpack image and different prices for all products
test('visual_user shows a different backpack image', async ({ page }) => {
  await loginAs(page, USERS.VISUAL);
  const product = new ProductPage(page);

  await expect(product.page.locator('#item_4_img_link img')).toHaveAttribute(
    'src',PROBLEM_IMAGE_SRC);

  const visualPrices = await product.page
    .locator('[data-test="inventory-item-price"]')
    .evaluateAll((prices) =>
      prices.map((price) => Number(price.textContent?.replace('$', ''))),
    );
  expect(visualPrices).toHaveLength(6);
  visualPrices.forEach((price, index) => {
    expect(price).not.toBe(standardPrices[index]);
  });
});

//performance_glitch_user should have a slow login and the standard backpack image
test('performance_glitch_user has a slow login and the standard backpack image', async ({ page }) => {
  test.setTimeout(120_000);
  const login = new LoginPage(page);
  await login.goto();

  const loginStartedAt = Date.now();
  await login.login(USERS.PERFORMANCE_GLITCH, PASSWORD);
  await login.expectLoggedIn();
  const product = new ProductPage(page);
  const loginDuration = Date.now() - loginStartedAt;

  expect(loginDuration).toBeGreaterThanOrEqual(5_000);
  await expect(
    product.backpackImage,
  ).toHaveAttribute('src', BACKPACK_IMAGE_SRC);
});

//problem_user should see different images for all six products as standard user
//sees the same backpack image 'PROBLEM_IMAGE_SRC'
test('problem_user shows the problem image for all products', async ({ page }) => {
  await loginAs(page, USERS.PROBLEM);
  const product = new ProductPage(page);

  const imageSources = await product.inventoryImages.evaluateAll((images) =>
    images.map((image) => image.getAttribute('src')),
  );

  expect(imageSources).toHaveLength(6);
  expect(imageSources).toEqual(Array(6).fill(PROBLEM_IMAGE_SRC));
});

//locked_out_user should not be able to log in and should see the locked out error message
test('locked_out_user cannot log in', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(USERS.LOCKED_OUT, PASSWORD);
  await login.expectLockedOutError();
});
