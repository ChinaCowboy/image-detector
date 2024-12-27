import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

function ImgImporter() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  function readImage(file) {
    return new Promise((rs, rj) => {
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => rj(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  }

  async function handleImgUpload(event) {
    const {
      target: { files },
    } = event;

    const _file = files[0];
    const fileData = await readImage(_file);
    setFile(fileData);
    setProcessing(true);
  }

  useEffect(() => {
    async function loadModel() {
      if (!model) {
        const HOSTED_MODEL_PATH =
          "https://storage.googleapis.com/tfjs-examples/simple-object-detection/dist/object_detection_model/model.json";

        const _model = await tf.loadLayersModel(HOSTED_MODEL_PATH);
        setModel(_model);
      }
    }

    loadModel();
  });

  useEffect(() => {
    async function predict() {
      if (imageLoaded && file) {
        const imageElement = document.createElement("img");
        imageElement.src = file;

        imageElement.onload = async () => {
          const tensor = tf.browser
            .fromPixels(imageElement, 1)
            .resizeNearestNeighbor([380, 380])
            .expandDims()
            .toFloat();

          const prediction = await model.predict(tensor).data();

          setPrediction(parseInt(prediction, 10));
          setProcessing(false);
          setImageLoaded(false);
        };
      }
    }

    predict();
  }, [imageLoaded, model, file]);

  return (
    <div className="File-input-container">
      <form className="Form">
        <label htmlFor="upload-image">Upload image</label>
        <input
          id="image-selector"
          type="file"
          name="upload-image"
          accept="image/*"
          className="File-selector"
          onChange={handleImgUpload}
          disabled={!model || processing}
        />
      </form>
      <div className="Img-display-container">
        <img
          onLoad={() => {
            setImageLoaded(true);
          }}
          alt=""
          src={file}
        />
      </div>
      <div className="Img-processing-container">
        {processing ? (
          <p>Loading ...</p>
        ) : prediction !== null ? (
          <div>
            <p>{prediction === 1 ? "Yes" : "No"}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ImgImporter;
