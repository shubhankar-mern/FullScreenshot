const ScreenshotGenerator = require('../app');
const path = require('path');
const sanitize = require('sanitize-filename');
const archiver = require('archiver');
const fs = require('fs');
// Example usage



async function download (req, res) {
    try {
      const url = req.body.url;
              console.log('url::',url);
              const websiteURL = url; 
              const start = websiteURL.indexOf('www.') + 4;
              const end = websiteURL.indexOf('.com');
              const extractedString = websiteURL.substring(start, end);
              const currentDate = new Date().getFullYear().toString();
              const randomNumber = Math.floor(Math.random() * 10000) + 1;
              const imgPath = path.join('./image', `${extractedString}${currentDate}-${randomNumber}.png`);
              const gifPath = path.join('./gif', `${extractedString}${currentDate}-${randomNumber}.gif`);
              const pdfPath = path.join('./pdf', `${extractedString}${currentDate}-${randomNumber}.pdf`);
              const zipPath = path.join('./zip', `${extractedString}${currentDate}-${randomNumber}.zip`);

          const generator = new ScreenshotGenerator(websiteURL, imgPath, gifPath, pdfPath);

          generator.generateScreenshot()
            .then(async() => {
              console.log('Screenshot and PDF generated successfully.');
              const sanitizedFilenameImg = sanitize(`${extractedString}${currentDate}-${randomNumber}.png`);
              const sanitizedFilenamePdf = sanitize(`${extractedString}${currentDate}-${randomNumber}.pdf`);
              console.log('santitizedimg ::',sanitizedFilenameImg);
              console.log('santitizedpdf ::',sanitizedFilenamePdf);

                // Create a zip file
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);
        archive.file(imgPath, { name: sanitizedFilenameImg });
        archive.file(pdfPath, { name: sanitizedFilenamePdf });
        await archive.finalize();

         // Delete the zip file after it has been sent
         const deleteZipFile = () => {
          fs.unlink(zipPath, (err) => {
            if (err) {
              console.error('Failed to delete the zip file:', err);
            }
          });
          fs.unlink(imgPath, (err) => {
            if (err) {
              console.error('Failed to delete the image file:', err);
            }
          });
          fs.unlink(pdfPath, (err) => {
            if (err) {
              console.error('Failed to delete the pdf file:', err);
            }
          });
        };

        // Send the zip file as a download response
       const downloadStream = fs.createReadStream(zipPath);
       downloadStream.on('end', deleteZipFile);

        // Set the headers to trigger the file download
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename="${extractedString}${currentDate}-${randomNumber}.zip"`);
        res.cookie('Alphabro', 'Alphabro');
       downloadStream.pipe(res);
    //  res.download(zipPath, () => {
    //   deleteZipFile();
    //  });
            
            })
            .catch((error) => {
              console.error('Error generating screenshot:', error);
              req.flash('message', 'Failed to generate screenshot');
              res.redirect('/');
            });
              } catch (error) {
                req.flash('message','failed to generate screenshot');
               res.redirect('/');
              }
              
            };
  
// function deletezip (zipPath) {

//   fs.unlink(zipPath, (err) => {
//     if (err) {
//       console.error('Failed to delete the zip file:', err);
//     }
    
//   });
// };
 

  module.exports = {
    download
  };