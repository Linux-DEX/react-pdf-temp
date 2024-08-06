import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import * as pdfjsLib from 'pdfjs-dist';
//import 'pdfjs-dist/build/pdf.worker.entry'; // Import the worker entry point
import { pdfjs } from "react-pdf";
import { calculateNewValue } from '@testing-library/user-event/dist/utils';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl }) => {
  const [pageText, setPageText] = useState({});
  const [selectedText, setSelectedText] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [ error, setError ] = useState(null);
  const [ pageDimensions, setPageDimensions ] = useState({ width: 0, height: 0 });
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadTextContent = async () => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const numPages = pdf.numPages;
      const texts = {};

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        texts[i] = textContent.items.map(item => ({
          str: item.str,
          transform: item.transform
        }));
      }

      setPageText(texts);
    };

    loadTextContent();
  }, [pdfUrl]);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      const text = selection.toString();
      setSelectedText(text);
    }
  };

  const extractTextCoordinates = (pageNum, selectedText) => {
    const textItems = pageText[pageNum] || [];
    return textItems.filter(item => item.str.includes(selectedText));
  };

  const calculateTextDimensions = (coords) => {
    if (coords.length === 0) return { width: -1, height: -1 };
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    coords.forEach((coords) => {
      const [a, b, c, d, e, f] = coords.transform;
      const x = e;
      const y = f;
      const width = a;
      const height = d;
      
      console.log(`Text: ${coords.str}`);
      console.log(`Coordinates: x: ${e}, y: ${f}`);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + width);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + height);
    });

    return {
      width: maxX - minX,
      height: maxY - minY
    };
  };

  useEffect(() => {
    if (selectedText && pageText[pageNumber]) {
      const coords = extractTextCoordinates(pageNumber, selectedText);
      //coords.forEach(coord => {
      //  const [a, b, c, d, e, f] = coord.transform;
      //  console.log(`Text: ${coord.str}`);
      //  console.log(`Coordinates: x: ${e}, y: ${f}`);
      //  console.log(`scaling factor: a: ${a} d: ${d} `)
      //  console.log(`skewing factor: b: ${b} c: ${c} `)
      //});
      const dimensions = calculateTextDimensions(coords);
      setTextDimensions(dimensions);
    }
  }, [selectedText, pageNumber, pageText]);

  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError(error.message || 'Unknown error');
  };

  const onPageLoadSuccess = ({ width, height }) => {
    setPageDimensions({ width, height });
    // below code will console all page dimensions at same time
    //console.log("width: ", width);
    //console.log("height: ", height);
  };

  return (
    <div>
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
        onLoadError={onLoadError}
      >
        {[...Array(pageNumber)].map((_, index) => (
          <Page
            key={index + 1}
            pageNumber={index + 1}
            renderTextLayer={true}
            onClick={handleSelection}
            onLoadSuccess={onPageLoadSuccess}
          />
        ))}
      </Document>
      {selectedText && (
        <div>
          <div>Selected Text: {selectedText}</div>
          <div>
            Text Dimensions: Width: {textDimensions.width}px, Height: {textDimensions.height}px
          </div>
        </div>
      )}
      {selectedText && <div>Selected Text: {selectedText}</div>}
      <div>
        <p>Current page dimensions:</p>
        <p>Width: {pageDimensions.width}px</p>
        <p>Height: {pageDimensions.height}px</p>
      </div>
      { error & <div>Error: { error }</div>}
    </div>
  );
};

export default PdfViewer;

