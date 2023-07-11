import puppeteer from 'puppeteer';
import fs from 'fs';
import { PNG } from 'pngjs';
import { createCanvas } from 'canvas';
import GIFEncoder from 'gifencoder';
import { PDFDocument } from 'pdf-lib';

const websiteURL = 'https://www.marvel.com/movies';
const imgPath = './image/sampleImage.png';
const gifPath = './gif/sampleGif.gif';
const pdfPath = './pdf/samplePDF.pdf';

async function generateScreenshot(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'load' });
  //await page.goto(url, { waitUntil: 'networkidle0' });

  // Calculate the height of the page by evaluating the height of the content
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

  // Set the height of the viewport to match the height of the content
  await page.setViewport({ width: 1920, height: bodyHeight }); // Set y

  const screenshot = await page.screenshot({ path: imgPath, fullPage: true });
  //await convertToGif(imgPath, gifPath);
  await generatePdfFromPng(screenshot, pdfPath);
  await browser.close();
}

async function generatePdfFromPng(pngData, outputPath) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Load the PNG data
  const pngImage = await pdfDoc.embedPng(pngData);

  // Add a new page to the PDF document with the PNG image as its content
  const page = pdfDoc.addPage();
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
  });

  // Save the PDF document to a file
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}
// Example usage
generateScreenshot(websiteURL)
  .then(() => {
    console.log('Screenshot, PDF generated successfully.');
  })
  .catch((error) => {
    console.error('Error generating screenshot:', error);
  });
