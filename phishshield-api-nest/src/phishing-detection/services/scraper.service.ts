import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScraperService {
  constructor(private readonly configService: ConfigService) {
  }

  async scrapeWebsite(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await new Promise(resolve => setTimeout(resolve, 5000));

    let htmlContent = await page.content();
    htmlContent = htmlContent.replace(/['"]/g, '');

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    const base64Image = Buffer.from(screenshotBuffer).toString('base64');

    const formData = new FormData();
    formData.append('image', base64Image);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${this.configService.get<string>('FILE_API_KEY')}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    await browser.close();

    return {
      htmlContent,
      screenshotBuffer,
      imageUrl: response.data.data.image.url,
    };
  }
}
