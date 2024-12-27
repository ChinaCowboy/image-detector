// https://github.com/tensorflow/tfjs-examples/blob/master/webcam-transfer-learning/index.js

import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfd from "@tensorflow/tfjs-data";
import Webcam from "react-webcam";
import { ObjectDetectorContainer } from "../style";

const CameraDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef();
  const [webcam, setwebcam] = useState(null);

  const [imgSrc, setImgSrc] = useState(null);

  const [model, setModel] = useState(null);
  const handleVideoOnPlay = () => {};

  const retake = () => {
    setImgSrc(null);
  };
  const getUserMediaSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };
  const capture = async () => {
    const imageSrc = videoRef.current.getScreenshot();
    setImgSrc(imageSrc);
    const modelOut = await model.predict(imageSrc).data();
    console.log("model out :", modelOut);
    // if (webcam) setImgSrc(await webcam.capture());
  };

  useEffect(() => {
    const loadModel = async () => {
      const LOCAL_MODEL_PATH =
        process.env.PUBLIC_URL +
        "/models/mobilenet-v2-tfjs-035-128-classification-v3/model.json";
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

  const load = async () => {
    if (videoRef.current && !webcam) {
      try {
        webcam = await tfd.webcam(videoRef.current.video);
        setwebcam(webcam);
        const truncatedMobileNet = await loadMobileNet();
        // Warm up the model. This uploads weights to the GPU and compiles the WebGL
        // programs so the first time we collect data from the webcam it will be
        // quick.
        const screenShot = await webcam.capture();
        truncatedMobileNet.predict(screenShot.expandDims(0));
        screenShot.dispose();
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Loads mobilenet and returns a model that returns the internal activation
  // we'll use as input to our classifier model.
  const loadMobileNet = async () => {
    const mobilenet = await tf.loadLayersModel(
      "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    );

    // Return a model that outputs an internal activation.
    const layer = mobilenet.getLayer("conv_pw_13_relu");
    return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
  };

  return (
    <ObjectDetectorContainer>
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <div>
          <Webcam
            ref={videoRef}
            onPlay={handleVideoOnPlay}
            height={600}
            width={600}
            style={{ borderRadius: "10px", display: "block" }}
            //play ={ captureVideo}
            //autoPlay
            className="video-stream"
          />
          <canvas ref={canvasRef} style={{ position: "absolute" }} />
        </div>
      )}

      <div className="btn-container">
        {imgSrc ? (
          <button onClick={retake}>Retake photo</button>
        ) : (
          <button onClick={capture}>Capture photo</button>
        )}
      </div>
    </ObjectDetectorContainer>
  );
};

export default CameraDetector;
