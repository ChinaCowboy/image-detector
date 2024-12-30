import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import "./ImageModelPredict.css";
function ImageModelPredict() {
  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const URL = "https://teachablemachine.withgoogle.com/models/VEYE-ccHc/";
  const webcamRef = React.useRef(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    // const modelURL = URL + "model.json";
    // const metadataURL = URL + "metadata.json";
    const modelURL =
      "https://storage.googleapis.com/tm-model/VEYE-ccHc/model.json";

    const metadataURL =
      "https://storage.googleapis.com/tm-model/VEYE-ccHc/metadata.json";
    const tmModel = await tmImage.load(modelURL, metadataURL);
    setModel(tmModel);
    setMaxPredictions(tmModel.getTotalClasses());
  }

  async function predict(webcamRef, labelContainer) {
    if (model && webcamRef && webcamRef.current && labelContainer) {
      const prediction = await model.predict(webcamRef.current.video);
      for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        labelContainer.childNodes[i].style.width =
          prediction[i].probability.toFixed(2) * 100 + "%";
      }
    }
  }
  const loop = async () => {
    await predict(webcamRef, document.getElementById("label-container"));
    window.requestAnimationFrame(loop);
  };

  return (
    <div>
      <div>Teachable Machine Image Model</div>
      <button type="button" onClick={loop} className="button">
        Start
      </button>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={400}
        height={800}
        screenshotFormat="image/jpeg"
      />
      <div class="container">
        <h2>Output:</h2>
        <div id="label-container" class="bar-container">
          {Array.from(Array(maxPredictions).keys()).map((index) => (
            <div key={index} class="bar usual"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageModelPredict;
