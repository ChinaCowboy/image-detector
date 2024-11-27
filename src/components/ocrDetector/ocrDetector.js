

import {TargetBox,SelectButton,CaptureButton,HiddenFileInput,TargetImg,DetectionContainer } from '../style';
import React, { useRef, useState } from "react";
import { createWorker,RecognizeOptions } from 'tesseract.js';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import Card from 'react-bootstrap/Card';


registerPlugin(FilePondPluginImagePreview);
const readImage = (file) => {
  return new Promise((rs, rj) => {
    const fileReader = new FileReader();
    fileReader.onload = () => rs(fileReader.result);
    fileReader.onerror = () => rj(fileReader.error);
    fileReader.readAsDataURL(file);
  });
};

export default function OcrComponent() {

  const pond = useRef();
 
  const imageRef = useRef();
  const [result, setResult] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);

  const [predictions, setPredictions] = useState([]);
  const isEmptyPredictions = !predictions || predictions.length === 0;

  const recognizeOpt = {rotateAuto: true};


  const detectObjectsOnImage = async (file,pond) => {
    const worker = await createWorker(['chi_sim', 'eng']);
    const imageElement = file.file
    setResult('');
    setIsRecognizing(true);
    setPredictions(null);
    (async () => {
      const { data: { text, words } } = await worker.recognize(imageElement, undefined, { text: true, blocks: true, hocr: false, tsv: false, layoutBlocks: true });
      setResult(text);

      // await showBlocksOnImg(pond,words); 
      await worker.terminate();
      setIsRecognizing(false);
    })();

  }

  const normalizePredictions = (words, imgSize) => {
    if (!words || !imgSize || !imageRef || !pond.current.file)  return words || [];
    
    return words.map((word) => {
      const bbox  = word.bbox;
      const oldX = bbox.x0;
      const oldY = bbox.y0;
      const oldWidth = bbox.x1-bbox.x0;
      const oldHeight = bbox.y1-bbox.y0;

      const imgWidth = pond.current.file.width;
      const imgHeight = pond.current.file.height;

      const x = (oldX * imgWidth) / imgSize.width;
      const y = (oldY * imgHeight) / imgSize.height;
      const width = (oldWidth * imgWidth) / imgSize.width;
      const height = (oldHeight * imgHeight) / imgSize.height;

      return { ...word, bbox: {x0 : x, y0 :y , x1:x+width, y1:y+height} };
    });
  };
  const showBlocksOnImg = async (imageElement,words) => {
    const imgSize = {
      width: imageElement.width,
      height: imageElement.height,
    };
    const normalizedPredictions = normalizePredictions(words, imgSize);
    setPredictions(normalizedPredictions);
  };

  return (
    <>      
    <h1>Extract text from the image</h1>
        <div>
        <div className="col-md-4">
          <FilePond ref={pond} allowImageSizeMetadata={true}
            onaddfile={(err, file) => {
              detectObjectsOnImage(file,FilePond);
            }}
            onremovefile={(err, file) => {
              setResult('');
            }}
          />
          </div>
          {!isEmptyPredictions && predictions
          .filter((word) => {
            return word.confidence > 1;
          })
          .map((word,i) => (
            <TargetBox        
            key={i}  
            x={word.bbox.x0}
            width={word.bbox.x1-word.bbox.x0}
            y={word.bbox.y0}
            height={word.bbox.y1-word.bbox.y0}
            score={word.confidence}
            classType= {word.text}
          />
          ))}
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
    <div>
    </div>

    </>

    )
  }
