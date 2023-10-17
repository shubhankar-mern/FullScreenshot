const puppeteer = require('puppeteer');

const fs  = require('fs');
// import { PNG } from 'pngjs';
// import { createCanvas } from 'canvas';
// import GIFEncoder from 'gifencoder';
const { PDFDocument } = require('pdf-lib');

const path = require('path');

class ScreenshotGenerator {
  constructor(websiteURL, imgPath, gifPath, pdfPath) {
    this.websiteURL = websiteURL;
    this.imgPath = imgPath;
    this.gifPath = gifPath;
    this.pdfPath = pdfPath;
  }

  async generateScreenshot() {
    const browser = await puppeteer.launch({
      headless: 'new',
      // `headless: true` (default) enables old Headless;
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(this.websiteURL, { waitUntil: 'load', timeout: 90000  });

    // Calculate the height of the page by evaluating the height of the content
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

    // Set the height of the viewport to match the height of the content
    await page.setViewport({ width: 1920, height: bodyHeight });
    // Ensure the directory for saving the screenshot exists
    const directory = path.dirname(this.imgPath);
    fs.mkdirSync(directory, { recursive: true });

    const screenshot = await page.screenshot({ path: this.imgPath, fullPage: true });
    //await this.convertToGif();
    await this.generatePdfFromPng(screenshot);

    await browser.close();
  }

  async generatePdfFromPng(pngData) {
    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(pngData);
    const page = pdfDoc.addPage();
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(this.pdfPath, pdfBytes);
  }

  async convertToGif() {
    // Add your code for converting to GIF here
  }
}

// Example usage
// const websiteURL = 'https://www.youtube.com/';
// const start = websiteURL.indexOf('www.') + 4;
// const end = websiteURL.indexOf('.com');
// const extractedString = websiteURL.substring(start, end);
// const currentDate = new Date().getFullYear().toString();
// const imgPath = path.join('./image', `${extractedString}${currentDate}.png`);
// const gifPath = path.join('./gif', `${extractedString}${currentDate}.gif`);
// const pdfPath = path.join('./pdf', `${extractedString}${currentDate}.pdf`);

// const generator = new ScreenshotGenerator(websiteURL, imgPath, gifPath, pdfPath);
// generator.generateScreenshot()
//   .then(() => {
//     console.log('Screenshot, PDF generated successfully.');
//   })
//   .catch((error) => {
//     console.error('Error generating screenshot:', error);
//   });


  module.exports = ScreenshotGenerator;