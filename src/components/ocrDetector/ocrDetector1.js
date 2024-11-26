

import {SelectButton,CaptureButton,HiddenFileInput,TargetImg,DetectionContainer } from '../style';
import React, { useRef, useState } from "react";
import { createWorker } from 'tesseract.js';

import styled from "styled-components";

const TargetBox = styled.div`
  position: absolute;
  left: ${({ x }) => x + "px"};
  top: ${({ y }) => y + "px"};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
  border: 4px solid #0056b3;
  background-color: black;
  z-index: 200;

  &::before {
    content: "${({ classType, score }) => `${classType} ${score.toFixed(1)}%`}";
    color: #1ac71a;
    font-weight: 500;
    font-size: 17px;
    position: absolute;
    top: -1.5em;
    left: -5px;
  }
`;
const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function OcrComponent() {
  const fileInputRef = useRef();
  const imageRef = useRef();

 
  const [imgData, setImgData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [result, setResult] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const isEmptyPredictions = !predictions || predictions.length === 0;

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const readImage = (file) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const onSelectImage = async (e) => {
    setIsRecognizing(true);
    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImgData(imgData);
    const imageElement = document.createElement("img");
    imageElement.src = imgData;
    imageElement.onload = async () => {
      const imgSize = {
        width: imageElement.width,
        height: imageElement.height,
      };

      await detectObjectsOnImage(imageElement);
 
      setIsRecognizing(false);
    };
  };

  const handleImageChange = (e) => {
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const detectObjectsOnImage = async (imageElement) => {
    const worker = await createWorker(['chi_sim','eng']);
      setError(null);
      setResult('');
      setIsRecognizing(true);
      setPredictions(null);
      await (async () => {
        const { data: {text,words}  } = await worker.recognize(imageElement);
        setResult(text);
        setPredictions(words);
        console.log(text);
        console.log(words);

        // const wordsElements = 
        //   words.filter(({ confidence }) => {
        //     return confidence > 10;
        //   }).map((word) => {
        //       const div = document.createElement('div');
        //       const { x0, x1, y0, y1 } = word.bbox;
        //       div.classList.add('word-element');
        //       Object.assign(div.style, {
        //         top: `${y0}px`,
        //         left: `${x0}px`,
        //         width: `${x1 - x0}px`,
        //         height: `${y1 - y0}px`,
        //         border: '1px solid black',
        //         position: 'absolute',
        //       });
        //       return div;
        //     });
       // imageElement.appendChild(imgData);
      //  imageElement.append(...wordsElements);
       // console.log(...wordsElements);

      //  const result=await worker.recognize(imageElement, undefined, {text: false, blocks: false, hocr: false, tsv: false, layoutBlocks: true});


        await worker.terminate();
      })();

  }


  return (
    <>      
    <h1>Extract text from the image</h1>
    <div>
    <ObjectDetectorContainer>
        <DetectionContainer>
          {imgData && <TargetImg src={imgData} ref={imageRef} />}
          {!isEmptyPredictions && predictions.map((word) => {
            <TargetBox          
            x= {word.bbox.x0}
            y= {word.bbox.y0}
            width = {word.bbox.x1}
            height ={word.bbox.y1}  
            // width= {word.bbox.x1-word.bbox.x0}
            // height={word.bbox.y1-word.bbox.y0}
            score={word.confidence}
          />
          })}
        </DetectionContainer>
        <div>
        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={onSelectImage}
        />
          <SelectButton onClick={openFilePicker}  disabled={isRecognizing}>
            {isRecognizing ? "Recognizing..." : "Select Image"}
          </SelectButton>

        </div>
        </ObjectDetectorContainer>
        {/* {error && <p>Error: {error}</p>}
        <div>
        {result && <pre>{result}</pre>} 
        </div> */}

    </div>
  
    </>

    )
  }
  