import { expect, test } from "@playwright/test";

test("приложение запускается и рендерит 3D-сцену", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/");

  await expect(page.getByText("House Studio")).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();

  expect(errors, `Обнаружены ошибки JS в консоли:\n${errors.join("\n")}`).toEqual([]);
});
