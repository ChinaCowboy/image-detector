

import { Headline,SelectButton,CaptureButton,HiddenFileInput,TargetImg,DetectionContainer } from '../style';
import React, { useRef, useState } from "react";
import { createWorker } from 'tesseract.js';


export default function OcrComponent() {
  const fileInputRef = useRef();
  const imageRef = useRef();
 
  const [imgData, setImgData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
 
  const [error, setError] = useState(null);
  const [result, setResult] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
 
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
    const worker = await createWorker(['eng', 'chi_tra']);
      setError(null);
      setResult('');
      setIsRecognizing(true);

      (async () => {
        const { data: { text } } = await worker.recognize(imageElement);
        setResult(text);
        console.log(text);
        await worker.terminate();
      })();

  }


  return (
    <>      
    <h1>Extract text from the image</h1>
    <div>
    <DetectionContainer>
        <div>
        {imgData && <TargetImg src={imgData} ref={imageRef} />}
        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={onSelectImage}
        />
             </div>
             </DetectionContainer>
        <div>
          <SelectButton onClick={openFilePicker}  disabled={isRecognizing}>
            {isRecognizing ? "Recognizing..." : "Select Image"}
          </SelectButton>

        </div>

        {error && <p>Error: {error}</p>}
        <div>
        {result && <pre>{result}</pre>} 
        </div>
    </div>
  
    </>

    )
  }
  