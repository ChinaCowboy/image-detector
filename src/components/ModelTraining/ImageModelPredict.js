import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";

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
      <button type="button" onClick={loop}>
        Start
      </button>
      <Webcam
        audio={false}
        ref={webcamRef}
        width={200}
        height={200}
        screenshotFormat="image/jpeg"
      />
      <div id="label-container">
        {Array.from(Array(maxPredictions).keys()).map((index) => (
          <div key={index}></div>
        ))}
      </div>
    </div>
  );
}

export default ImageModelPredict;
