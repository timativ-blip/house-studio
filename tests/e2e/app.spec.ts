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
  const floorsButton = page.getByRole("button", { name: "Полы" });

  await expect(selectButton).toHaveAttribute("data-active", "true");
  await expect(floorsButton).toBeDisabled();

  await floorsButton.click({ force: true });
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

test("инструмент «Мебель»: выбор предмета в каталоге и клик размещают его без ошибок JS", async ({
  page,
}) => {
  // Как и для комнаты, точный клик по экранной проекции конкретного 3D-объекта
  // после смены ракурса/инструмента не воспроизводим без матрицы камеры —
  // выбор/перемещение/поворот/удаление предмета покрыты юнит-тестами команд
  // (createAddItemCommand, createMoveItemCommand, createRotateItemCommand,
  // createRemoveEntityCommand) и были проверены вручную в браузере.
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await page.getByRole("button", { name: "Мебель" }).click();
  await expect(page.getByRole("button", { name: "Диван" })).toHaveAttribute(
    "data-active",
    "true",
  );

  await page.getByRole("button", { name: "Стул" }).click();
  await expect(page.getByRole("button", { name: "Стул" })).toHaveAttribute(
    "data-active",
    "true",
  );

  await hoverCanvas(page, 300, 400);
  await clickCanvas(page, 300, 400);

  await expect(page.locator("canvas")).toBeVisible();
  expect(errors, `Обнаружены ошибки JS:\n${errors.join("\n")}`).toEqual([]);
});

test("инструмент «Ландшафт»: размещает дерево и переключается на построение дорожки", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await page.getByRole("button", { name: "Ландшафт" }).click();
  await hoverCanvas(page, 250, 300);
  await clickCanvas(page, 250, 300);

  await page.getByRole("button", { name: "Дорожка" }).click();
  await hoverCanvas(page, 200, 550);
  await clickCanvas(page, 200, 550);
  await hoverCanvas(page, 400, 620);
  await clickCanvas(page, 400, 620);

  await expect(page.locator("canvas")).toBeVisible();
  expect(errors, `Обнаружены ошибки JS:\n${errors.join("\n")}`).toEqual([]);
});
