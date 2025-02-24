const puppeteer = require('puppeteer');
const { constants } = require('../constants');
const axios = require('axios');

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  await new Promise(resolve => setTimeout(resolve, 5000));

  let htmlContent = await page.content();
  htmlContent = htmlContent.replace(/['"]/g, '');

  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const base64Image = Buffer.from(screenshotBuffer).toString("base64");

  const API_KEY = constants.FILE_API_KEY;
  const formData = new FormData();
  formData.append('image', base64Image);

  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  await browser.close();

  return {
    htmlContent,
    screenshotBuffer,
    base64Image,
    "imageUrl": response.data.data.image.url
  };
}

module.exports = { scrapeWebsite };
