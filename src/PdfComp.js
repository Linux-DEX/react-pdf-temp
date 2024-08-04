import { Document, Page } from "react-pdf";
import pdf from "./fastapi.pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
//import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

function PdfComp() {

  return (
    <div className="pdf-div">
      <Document 
        file={pdf}
        options={{ workerSrc: 'pdf.worker.js'}}
      >
        <Page 
          pageNumber={4} 
          renderAnnotationLayer={false}
          renderMode={`canvas`}
        />
      </Document>
   
    </div>
  );
}
export default PdfComp;


