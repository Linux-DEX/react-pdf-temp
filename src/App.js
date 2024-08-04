import './App.css';
import PdfComp from './PdfComp';
import { pdfjs } from "react-pdf";
import { useEffect, useState } from 'react';
import PDFTextCoordinates from './PDFTextCoordinates';
import pdffile from "./fastapi.pdf";
import PdfViewer from './pdfViewer';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {

  //  useEffect(() => {
  //  const handleRightClick = (event) => {
  //    event.preventDefault();
  //  };
  //
  //  document.addEventListener('contextmenu', handleRightClick);
  //
  //  return () => {
  //    document.removeEventListener('contextmenu', handleRightClick);
  //  };
  //}, []);

  const [textContent, setTextContent] = useState([]);
  const [selectedText, setSelectedText] = useState(null);

  const handleTextExtracted = (textData) => {
    setTextContent(textData);
  };

  const handleSelection = (event) => {
    const selectedText = window.getSelection().toString();
    setSelectedText(selectedText);

    // Find coordinates for the selected text
    const coordinates = findTextCoordinates(selectedText, textContent);
    console.log('Coordinates:', coordinates);
  };


  const findTextCoordinates = (selectedText, textContentArray) => {
    for (const page of textContentArray) {
      for (const item of page.items) {
        if (item.str.includes(selectedText)) {
          // Transform matrix provides position; extract if needed
          return {
            page: page.page,
            text: item.str,
            coordinates: item.transform,
          };
        }
      }
    }
    return null;
  };

  return (
    <div className="App">
      //<h2>React pdf testing</h2>
      //<PdfComp />
      //<PDFTextCoordinates file={pdffile}/>
      <PdfViewer pdfUrl={pdffile}/>
    </div>
  );
}

export default App;
