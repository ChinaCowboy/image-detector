import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import "./FaceRecognition.css";

const FaceRecognition = () => {
  const [capturedImages, setCapturedImages] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef();

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detections, setDetections] = useState([]);

  const [captureVideo, setCaptureVideo] = useState(false);

  const videoHeight = 480;
  const videoWidth = 640;
  // const modelPath = '../model/'; // path to model folder that will be loaded using http
  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ageGenderNet.load(MODEL_URL);
      setModelsLoaded(true);
      console.log("Models loaded");
    };

    loadModels();
  }, []);

  const getUserMediaSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };
  // useEffect(() => {
  //   const startVideo = () => {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: {} })
  //       .then((stream) => {
  //         videoRef.current.srcObject = stream;
  //       })
  //       .catch((err) => console.error(err));
  //   };
  //   startVideo();
  // }, [videoRef]);
  // helper function to draw detected faces
  function faces(name, title, id, data) {
    // create canvas to draw on
    const img = document.getElementById(id);
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.left = `${img.offsetLeft}px`;
    canvas.style.top = `${img.offsetTop}px`;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    // draw title
    ctx.font = "1rem sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(name, 2, 15);
    ctx.fillText(title, 2, 35);
    for (const person of data) {
      // draw box around each face
      ctx.lineWidth = 3;
      ctx.strokeStyle = "deepskyblue";
      ctx.fillStyle = "deepskyblue";
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.rect(
        person.detection.box.x,
        person.detection.box.y,
        person.detection.box.width,
        person.detection.box.height
      );
      ctx.stroke();
      // draw text labels
      ctx.globalAlpha = 1;
      ctx.fillText(
        `${Math.round(100 * person.genderProbability)}% ${person.gender}`,
        person.detection.box.x,
        person.detection.box.y - 18
      );
      ctx.fillText(
        `${Math.round(person.age)} years`,
        person.detection.box.x,
        person.detection.box.y - 2
      );
      // draw face points for each face
      ctx.fillStyle = "lightblue";
      ctx.globalAlpha = 0.5;
      const pointSize = 2;
      for (const pt of person.landmarks.positions) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pointSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    // add canvas to document
    document.body.appendChild(canvas);
  }

  // helper function to draw processed image and its results
  function print(title, img, data) {
    console.log("Results:", title, img, data); // eslint-disable-line no-console
    const el = new Image();
    el.id = Math.floor(Math.random() * 100000).toString();
    el.src = img;
    el.width = videoWidth;
    el.onload = () => faces(img, title, el.id, data);
    document.body.appendChild(el);
  }

  const startVideo = () => {
    if (getUserMediaSupported()) {
      setCaptureVideo(true);
      navigator.mediaDevices
        .getUserMedia({ video: { width: 300 } })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("error:", err);
        });
    }
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        setDetections(detections);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvasRef &&
          canvasRef.current &&
          canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, displaySize.width, displaySize.height);
        if (canvasRef && canvasRef.current) {
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );
          print("TinyFace:", canvasRef.current, resizedDetections);
        }
      }
    }, 100);
  };

  const captureImage = () => {
    const video = videoRef.current;

    if (video) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw detections and expressions on the canvas
      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height,
        });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }

      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImages([...capturedImages, dataUrl]);

      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload image.");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Image saved successfully", data);
        })
        .catch((error) => {
          console.error("Error saving image:", error);
        });
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Close Webcam
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Open Webcam
          </button>
        )}
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <div
            className="face-recognition-container"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <video
              ref={videoRef}
              muted
              onPlay={handleVideoOnPlay}
              width={videoWidth}
              height={videoHeight}
              style={{ borderRadius: "10px" }}
              //play ={ captureVideo}
              // autoPlay
              className="video-stream"
            />
            <canvas ref={canvasRef} style={{ position: "absolute" }} />
          </div>
        ) : (
          <p>Loading models...</p>
        )
      ) : (
        <></>
      )}

      <div style={{ textAlign: "center", padding: "10px" }}>
        <button
          onClick={captureImage}
          className="capture-button"
          style={{
            cursor: "pointer",
            backgroundColor: "green",
            color: "white",
            padding: "15px",
            fontSize: "25px",
            border: "none",
            borderRadius: "10px",
          }}
        >
          {" "}
          Capture Image
        </button>
      </div>
      <div className="captured-images-container">
        {capturedImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Captured ${index}`}
            className="captured-image"
          />
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
