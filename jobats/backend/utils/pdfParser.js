const fs = require('fs');
const PDFParser = require('pdf2json');

const extractTextFromPDF = (input) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on('pdfParser_dataError', (errData) => {
      console.error('PDF Parser Error:', errData.parserError);
      reject(new Error('Failed to parse PDF: ' + errData.parserError));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        let text = '';

        if (pdfData && pdfData.Pages) {
          pdfData.Pages.forEach((page) => {
            if (page.Texts) {
              page.Texts.forEach((textItem) => {
                if (textItem.R && textItem.R[0] && textItem.R[0].T) {
                  try {
                    text += decodeURIComponent(textItem.R[0].T) + ' ';
                  } catch (e) {
                    text += textItem.R[0].T + ' ';
                  }
                }
              });
            }
            text += '\n';
          });
        }

        if (!text.trim()) {
          console.error('PDF Parser Warning: Text is empty after extraction');
          reject(new Error('No text could be extracted from PDF'));
        } else {
          console.log('PDF Parser Success: Extracted', text.length, 'characters');
          resolve(text.trim());
        }
      } catch (error) {
        reject(new Error('Failed to extract text: ' + error.message));
      }
    });

    if (Buffer.isBuffer(input)) {
      pdfParser.parseBuffer(input);
    } else {
      pdfParser.loadPDF(input);
    }
  });
};

module.exports = { extractTextFromPDF };