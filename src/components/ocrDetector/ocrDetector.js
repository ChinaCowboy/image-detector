

import { Headline,SelectButton,CaptureButton,HiddenFileInput,TargetImg,DetectionContainer } from '../style';
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
  const [error, setError] = useState(null);
  const [result, setResult] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [layoutBlock, SetLayoutBlock] = useState([]);
  const [imageElementCopy, setimageElementCopy] = useState(null);

  const recognizeOpt = {rotateAuto: true};


  const detectObjectsOnImage = async (file,imageElement) => {
    const worker = await createWorker(['chi_sim','eng']);
      setError(null);
      setResult('');
      setIsRecognizing(true);

      (async () => {
        const { data: {text,words} } = await worker.recognize(imageElement,undefined, {text: true, blocks: true, hocr: false, tsv: false, layoutBlocks: true});
        setResult(text);

        console.log(text);
        SetLayoutBlock(words);
        console.log(words);

        await showBlocksOnImg(file.file,words);
       //  const data=await worker.recognize(imageElement, undefined, {text: true, blocks: false, hocr: false, tsv: false, layoutBlocks: true});


        await worker.terminate();
        setIsRecognizing(false);
      })();

  }

  const showBlocksOnImg = async (imageElement,words) => {
    // https://blog.logrocket.com/how-to-extract-text-from-an-image-using-javascript-8fe282fb0e71/
    const imageElementCopy = document.createElement("img");
    const imgData = await readImage(imageElement);
    imageElementCopy.src = imgData;
    imageElementCopy.onload = async () => {
      const imgSize = {
        width: imageElement.width,
        height: imageElement.height,
      };
    }
    setimageElementCopy(imageElementCopy);
    const wordsElements = 
          words.filter(({ confidence }) => {
            return confidence > 10;
          }).map((word) => {
              const div = document.createElement('div');
              const { x0, x1, y0, y1 } = word.bbox;
              div.classList.add('word-element');
              Object.assign(div.style, {
                top: `${y0}px`,
                left: `${x0}px`,
                width: `${x1 - x0}px`,
                height: `${y1 - y0}px`,
                border: '1px solid black',
                position: 'absolute',
              });
              return div;
            });
      
      //imageElementCopy.appendChild(pond.current.imageElement);
      imageElementCopy.append(...wordsElements);
      console.log(...wordsElements);
  };

  return (
    <>      
    <h1>Extract text from the image</h1>
    <div>
        <div className="col-md-4">
          <FilePond ref={pond}
            onaddfile={(err, file) => {
              detectObjectsOnImage(file,file.file);

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
    <div>
    <img src={imageElementCopy} ref={imageRef} />
    </div>

    </>

    )
  }
