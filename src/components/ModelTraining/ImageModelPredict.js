import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import "./ImageModelPredict.css";
import { ObjectDetectorContainer } from "../style";
import {
  DetectionContainer,
  TargetBox,
  SelectButton,
  HiddenFileInput,
  TargetImg,
} from "../style";
function ImageModelPredict() {
  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [isCamera, setIsCamera] = useState(false);

  //  const URL = "https://teachablemachine.withgoogle.com/models/VEYE-ccHc/";

  const URL = process.env.PUBLIC_URL + "/models/stamp/";
  const webcamRef = React.useRef(null);
  const [predictions, setPredictions] = useState(Array(maxPredictions).fill(0));
  const fileInputRef = useRef();
  const imageRef = useRef();
  const [isLoading, setLoading] = useState(false);
  const [imgData, setImgData] = useState(null);
  const isEmptyPredictions = !predictions || predictions.length === 0;

  useEffect(() => {
    init();
  }, []);

  const readImage = (file) => {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };

  const onSelectImage = async (e) => {
    setLoading(true);
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
      //  await detectObjectsOnImage(imageElement, imgSize);
      await predictImage(imageRef.current);
      setLoading(false);
    };
  };
  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  async function init() {
    const modelURL = URL + "stamp-model.json";
    const metadataURL = URL + "stamp-metadata.json";
    // const modelURL =
    //   "https://storage.googleapis.com/tm-model/VEYE-ccHc/model.json";

    // const metadataURL =
    //   "https://storage.googleapis.com/tm-model/VEYE-ccHc/metadata.json";

    const tmModel = await tmImage.load(modelURL, metadataURL);
    setModel(tmModel);
    setMaxPredictions(tmModel.getTotalClasses());
  }
  async function predictImage(image) {
    if (model && image) {
      const predictions = await model.predict(image);
      setPredictions(predictions);
    }
  }
  async function predict(webcamRef) {
    if (model && webcamRef && webcamRef.current) {
      const predictions = await model.predict(webcamRef.current.video);
      console.log(predictions);
      setPredictions(predictions);
    }
  }
  const loop = async () => {
    await predict(webcamRef);
    window.requestAnimationFrame(loop);
  };

  const CameraOrImageClick = () => {
    setIsCamera(!isCamera);
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div>
        <h1>Teachable Machine Image Model</h1>
      </div>
      <div className="radio-container">
        <h2>Add Image Samples:</h2>
        <label className="radio-label">
          <input
            type="radio"
            name="mode"
            value="camera"
            checked={isCamera}
            onChange={CameraOrImageClick}
            className="radio-input"
          />
          Camera
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="mode"
            value="image"
            checked={!isCamera}
            onChange={CameraOrImageClick}
            className="radio-input"
          />
          Image
        </label>
      </div>

      {isCamera && (
        <ObjectDetectorContainer>
          <div style={{ textAlign: "center" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              width={180}
              height={300}
              screenshotFormat="image/jpeg"
              className="video-element"
            />
          </div>
          <SelectButton type="button" onClick={loop} className="button">
            Start
          </SelectButton>
        </ObjectDetectorContainer>
      )}
      {!isCamera && (
        <ObjectDetectorContainer>
          <DetectionContainer>
            {imgData && <TargetImg src={imgData} ref={imageRef} />}
          </DetectionContainer>
          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={onSelectImage}
          />
          <SelectButton onClick={openFilePicker}>
            {isLoading ? "Recognizing..." : "Select Image"}
          </SelectButton>
        </ObjectDetectorContainer>
      )}
      <div className="label-container">
        <h2>Output:</h2>
        <div id="bar-container" className="bar-container">
          {!isEmptyPredictions &&
            predictions.map((pre, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span
                  className="title"
                  style={{
                    marginRight: "10px",
                    marginTop: "20px",
                    width: "160px",
                  }}
                >
                  {pre.className}
                </span>
                <div
                  className={`bar usual${index} title`}
                  style={{ width: `${pre.probability * 100}%` }}
                >
                  {(pre.probability * 100).toFixed(0) + "%"}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ImageModelPredict;
