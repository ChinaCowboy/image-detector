import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs-backend-cpu";
//import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetectorContainer = styled.div`
  min-width: 200px;
  height: 500px;
  border: 3px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const TargetBox = styled.div`
  position: absolute;

  left: ${({ x }) => x + "px"};
  top: ${({ y }) => y + "px"};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};

  border: 4px solid #1ac71a;
  background-color: transparent;
  z-index: 20;

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

const SelectButton = styled.button`
  padding: 7px 10px;
  border: 2px solid transparent;
  background-color: #fff;
  color: #ce5813;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  margin-top: 2em;
  cursor: pointer;
  transition: all 260ms ease-in-out;

  &:hover {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;
const TargetImg = styled.img`
  height: 100%;
`;

export function ObjectDetector(props) {
  const fileInputRef = useRef();
  const imageRef = useRef();
  const [isLoading, setLoading] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(null);
  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  useEffect(() => {
    const loadModel = async () => {
      const LOCAL_MODEL_PATH =
        process.env.PUBLIC_URL +
        "/models/tiny_face_detector_model-weights_manifest.json";
      const HOSTED_MODEL_PATH =
        "https://storage.googleapis.com/tfjs-examples/simple-object-detection/dist/object_detection_model/model.json";

      try {
        let loadmodel = null;
        loadmodel = await tf.loadLayersModel(HOSTED_MODEL_PATH);
        loadmodel.summary();
        setModel(loadmodel);
      } catch (err) {
        console.log("load model error :", err);
      }
    };
    if (model === null) {
      loadModel();
      console.log("model loaded");
    }
  }, [model]); //watch the values for this and execute when changes

  const isEmptyPredictions = !predictions || predictions.length === 0;

  const normalizePredictions = (predictions, imgSize) => {
    if (!predictions || !imgSize || !imageRef) return predictions || [];
    return predictions.map((prediction) => {
      const { bbox } = prediction;
      const oldX = bbox[0];
      const oldY = bbox[1];
      const oldWidth = bbox[2];
      const oldHeight = bbox[3];

      const imgWidth = imageRef.current.width;
      const imgHeight = imageRef.current.height;

      const x = (oldX * imgWidth) / imgSize.width;
      const y = (oldY * imgHeight) / imgSize.height;
      const width = (oldWidth * imgWidth) / imgSize.width;
      const height = (oldHeight * imgHeight) / imgSize.height;

      return { ...prediction, bbox: [x, y, width, height] };
    });
  };

  const detectObjectsOnImage = async (imageElement, imgSize) => {
    //const model = await cocoSsd.load({});
    //const predictions = await model.detect(imageElement, 6);
    const imgTensors = [];

    // const tensorImage= tf.browser.fromPixels(imageElement.)
    // imgTensors.push(imageElement.);
    const imgs = tf.stack(imgTensors);

    const predictions = await model.predict(imgs).data();

    console.log("Predictions: ", predictions);

    const normalizedPredictions = normalizePredictions(predictions, imgSize);
    setPredictions(normalizedPredictions);
    console.log("Predictions: ", predictions);

    // cocoSsd.load().then(model => {
    //   // detect objects in the image.
    //   model.detect(imageElement).then(predictions => {
    //     const normalizedPredictions = normalizePredictions(predictions, imgSize);
    //     setPredictions(normalizedPredictions);
    //     console.log("Predictions: ", predictions);
    //       });
    // });
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
      await detectObjectsOnImage(imageElement, imgSize);

      setLoading(false);
    };
  };

  return (
    <ObjectDetectorContainer>
      <DetectorContainer>
        {imgData && <TargetImg src={imgData} ref={imageRef} />}
        {!isEmptyPredictions &&
          predictions.map((prediction, idx) => (
            <TargetBox
              key={idx}
              x={prediction.bbox[0]}
              y={prediction.bbox[1]}
              width={prediction.bbox[2]}
              height={prediction.bbox[3]}
              classType={prediction.class}
              score={prediction.score * 100}
            />
          ))}
      </DetectorContainer>
      <HiddenFileInput
        type="file"
        ref={fileInputRef}
        onChange={onSelectImage}
      />

      <SelectButton onClick={openFilePicker}>
        {isLoading ? "Recognizing..." : "Select Image"}
      </SelectButton>
    </ObjectDetectorContainer>
  );
}
