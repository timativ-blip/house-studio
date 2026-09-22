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

test("инструмент «Выделение» активен, недоступные инструменты не переключаются", async ({
  page,
}) => {
  await page.goto("/");

  const selectButton = page.getByRole("button", { name: "Выделение" });
  const wallButton = page.getByRole("button", { name: "Стены" });

  await expect(selectButton).toHaveAttribute("data-active", "true");
  await expect(wallButton).toBeDisabled();

  await wallButton.click({ force: true });
  await expect(selectButton).toHaveAttribute("data-active", "true");

  await expect(page.getByText("40 × 40 м")).toBeVisible();
});
