import './App.css';
import PdfComp from './PdfComp';
import { pdfjs } from "react-pdf";

//pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//  "pdfjs-dist/build/pdf.worker.min.mjs",
//  import.meta.url
//).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  return (
    <div className="App">
      <h2>React pdf testing</h2>
      <PdfComp />
    </div>
  );
}

export default App;
