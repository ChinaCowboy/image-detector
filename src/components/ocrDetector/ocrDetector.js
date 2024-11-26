

import { Headline,SelectButton,CaptureButton,HiddenFileInput,TargetImg,DetectionContainer } from '../style';
import React, { useRef, useState } from "react";
import { createWorker } from 'tesseract.js';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import Card from 'react-bootstrap/Card';
registerPlugin(FilePondPluginImagePreview);

export default function OcrComponent() {

  const pond = useRef();
 

  const [error, setError] = useState(null);
  const [result, setResult] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
 

  const detectObjectsOnImage = async (imageElement) => {
    const worker = await createWorker(['chi_sim','eng']);
      setError(null);
      setResult('');
      setIsRecognizing(true);

      (async () => {
        const { data: { text }  } = await worker.recognize(imageElement);
        setResult(text);
        console.log(text);

        const result=await worker.recognize(imageElement, undefined, {text: false, blocks: false, hocr: false, tsv: false, layoutBlocks: true});


        await worker.terminate();
        setIsRecognizing(false);
      })();

  }


  return (
    <>      
    <h1>Extract text from the image</h1>
    <div>
        <div className="col-md-4">
          <FilePond ref={pond}
            onaddfile={(err, file) => {
              detectObjectsOnImage(file.file);

            }}
            onremovefile={(err, file) => {
              setResult('');
            }}
          />
          </div>

    </div>
    <div className="col-md-4">
        <Card style={{ width: '26rem' }} className="mb-2">
          <Card.Body>
            <Card.Title style={{ width: '26=8rem' , color : "Menu" }}>Parsed Text  </Card.Title>
            <Card.Text>
              {isRecognizing ? "Recogizing...." : result.length === 0 ? "No Valid Text Found / Upload Image to Parse Text From Image" : result}
            </Card.Text>
          </Card.Body>
        </Card>
    </div>

    </>

    )
  }
  