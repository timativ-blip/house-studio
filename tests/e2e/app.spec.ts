import { expect, type Page, test } from "@playwright/test";

async function clickCanvas(page: Page, x: number, y: number) {
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas not found");
  await page.mouse.move(box.x + x, box.y + y);
  await page.mouse.click(box.x + x, box.y + y);
}

async function hoverCanvas(page: Page, x: number, y: number) {
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas not found");
  await page.mouse.move(box.x + x, box.y + y);
}

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
  const furnitureButton = page.getByRole("button", { name: "Мебель" });

  await expect(selectButton).toHaveAttribute("data-active", "true");
  await expect(furnitureButton).toBeDisabled();

  await furnitureButton.click({ force: true });
  await expect(selectButton).toHaveAttribute("data-active", "true");

  await expect(page.getByText("40 × 40 м")).toBeVisible();
});

test("инструмент «Стены»: две точки создают стену, которую можно выделить и удалить", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await page.getByRole("button", { name: "Стены" }).click();
  await hoverCanvas(page, 300, 300);
  await clickCanvas(page, 300, 300);
  await hoverCanvas(page, 500, 300);
  await clickCanvas(page, 500, 300);

  await page.getByRole("button", { name: "Выделение" }).click();
  await clickCanvas(page, 400, 300);

  await expect(page.getByRole("heading", { name: "Стена" })).toBeVisible();

  await page.getByRole("button", { name: "Удалить стену" }).click();
  await expect(page.getByRole("heading", { name: "Стена" })).not.toBeVisible();

  expect(errors, `Обнаружены ошибки JS:\n${errors.join("\n")}`).toEqual([]);
});

test("инструмент «Комнаты»: два клика строят комнату без ошибок JS", async ({ page }) => {
  // Проверка того, что клик по конкретной точке экрана попадает именно в
  // 3D-меш нужной стены, требует знания проекционной матрицы камеры и уже
  // покрыта юнит-тестами createRoomCommand (атомарность 4 стен + пол) —
  // здесь smoke-тест на отсутствие ошибок при полном сценарии из раздела 7.3.
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await page.getByRole("button", { name: "Комнаты" }).click();
  await hoverCanvas(page, 250, 250);
  await clickCanvas(page, 250, 250);
  await hoverCanvas(page, 550, 400);
  await clickCanvas(page, 550, 400);

  await expect(page.locator("canvas")).toBeVisible();
  expect(errors, `Обнаружены ошибки JS:\n${errors.join("\n")}`).toEqual([]);
});
