import './App.css';
import PdfComp from './PdfComp';
import { pdfjs } from "react-pdf";
import { useEffect, useState } from 'react';
import PDFTextCoordinates from './PDFTextCoordinates';
//import pdffile from "./fastapi.pdf";
import pdffile from "./test.pdf";
import PdfViewer from './pdfViewer';
import ContextMenu from './ContextMenu';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {

  // this code will disable right click completely
  //useEffect(() => {
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

    const coordinates = findTextCoordinates(selectedText, textContent);
    console.log('Coordinates:', coordinates);
  };


  const findTextCoordinates = (selectedText, textContentArray) => {
    for (const page of textContentArray) {
      for (const item of page.items) {
        if (item.str.includes(selectedText)) {
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
    <div 
      className="App"
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("right click");
      }}
    >
      <h1>React pdf - PdfViewer Component</h1>
      <PdfViewer pdfUrl={pdffile}/>
      <ContextMenu />
    </div>
  );
}

export default App;
