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
  const [predictions, setPredictions] = useState(Array(maxPredictions).fill(0));

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

  async function predict(webcamRef) {
    if (model && webcamRef && webcamRef.current) {
      const predictions = await model.predict(webcamRef.current.video);
      setPredictions(predictions);
    }
  }
  const loop = async () => {
    await predict(webcamRef);
    window.requestAnimationFrame(loop);
  };

  return (
    <div class="container">
      <div>
        <h1>Teachable Machine Image Model</h1>
      </div>

      <div style={{ textAlign: "center", padding: "10px" }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          width={400}
          height={800}
          screenshotFormat="image/jpeg"
          className="video-element video"
        />
      </div>
      <div style={{ textAlign: "center", padding: "10px" }}>
        <button type="button" onClick={loop} className="button">
          Start
        </button>
      </div>
      <div className="label-container">
        <h2>Output:</h2>
        <div id="bar-container" className="bar-container">
          {predictions.map((pre, index) => (
            <div
              key={index}
              className={`bar usual${index} title`}
              style={{ width: `${pre.probability * 100}%` }}
            >
              {pre.className}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageModelPredict;
