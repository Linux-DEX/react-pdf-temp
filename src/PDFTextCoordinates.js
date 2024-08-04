//import React, { useEffect, useState } from 'react';
//import * as pdfjsLib from 'pdfjs-dist/webpack';
//
//function PDFTextCoordinates({ file }) {
//  const [textContent, setTextContent] = useState([]);
//
//  useEffect(() => {
//    const fetchTextContent = async () => {
//      const loadingTask = pdfjsLib.getDocument(file);
//      const pdf = await loadingTask.promise;
//
//      const numPages = pdf.numPages;
//      const textContentArray = [];
//
//      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//        const page = await pdf.getPage(pageNum);
//        const textContentData = await page.getTextContent();
//        const textItems = textContentData.items;
//
//        textContentArray.push({
//          page: pageNum,
//          items: textItems.map(item => ({
//            str: item.str,
//            transform: item.transform,  // This contains coordinates and scaling
//          })),
//        });
//      }
//
//      setTextContent(textContentArray);
//    };
//
//    fetchTextContent();
//  }, [file]);
//
//  return (
//    <div>
//      {textContent.map(({ page, items }) => (
//        <div key={page}>
//          <h3>Page {page}</h3>
//          {items.map((item, index) => (
//            <p key={index}>
//              Text: {item.str} <br />
//              Coordinates: {item.transform.join(', ')}
//            </p>
//          ))}
//        </div>
//      ))}
//    </div>
//  );
//}
//
//export default PDFTextCoordinates;


import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';

function PDFTextCoordinates({ file, onTextExtracted }) {
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchTextContent = async () => {
      const loadingTask = pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);

      const textContentArray = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContentData = await page.getTextContent();
        const textItems = textContentData.items;

        textContentArray.push({
          page: pageNum,
          items: textItems.map(item => ({
            str: item.str,
            transform: item.transform,
          })),
        });
      }

      if (typeof onTextExtracted === 'function') {
        onTextExtracted(textContentArray);
      }
    };

    fetchTextContent();
  }, [file, onTextExtracted]);

  return <div>{pageCount ? `Total pages: ${pageCount}` : 'Loading...'}</div>;
}

export default PDFTextCoordinates;




