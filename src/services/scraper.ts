import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export const getGraphImage = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://outage.zakarpat.energy/schedule_queues", {
    waitUntil: "networkidle0",
  });

  const selector = await page
    .waitForSelector('img[alt="grafic"]', { timeout: 10000 })
    .catch(() => null);

  const imgUrl = await selector?.evaluate((el) => el.src);

  if (!imgUrl) {
    console.error("Image not found!");
    await browser.close();
    return;
  }

  const view = await page.goto(imgUrl);

  if (!view) {
    console.log("View not found");
    return;
  }

  const buffer = await view.buffer();
  const fileName = path.resolve(`graph-${Date.now()}.png`);
  fs.writeFileSync(fileName, buffer);

  console.log("Saved image as:", fileName);
  await browser.close();
};
