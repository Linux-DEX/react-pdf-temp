import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import * as pdfjsLib from 'pdfjs-dist';
//import 'pdfjs-dist/build/pdf.worker.entry'; // Import the worker entry point
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl }) => {
  const [pageText, setPageText] = useState({});
  const [selectedText, setSelectedText] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pdfContainerRef = useRef();
  const [ error, setError ] = useState(null);

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

  useEffect(() => {
    if (selectedText && pageText[pageNumber]) {
      const coords = extractTextCoordinates(pageNumber, selectedText);
      coords.forEach(coord => {
        const [a, b, c, d, e, f] = coord.transform;
        console.log(`Text: ${coord.str}`);
        console.log(`Coordinates: x: ${e}, y: ${f}`);
      });
    }
  }, [selectedText, pageNumber, pageText]);

  const onLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError(error.message || 'Unknown error');
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
          />
        ))}
      </Document>
      {selectedText && <div>Selected Text: {selectedText}</div>}
    </div>
  );
};

export default PdfViewer;

