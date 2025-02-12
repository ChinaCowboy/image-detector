import React, { useState, useRef } from "react";
import {
  ObjectDetectorContainer,
  SelectButton,
  HiddenFileInput,
  TargetImg,
  DetectionContainer,
} from "../style"; // Ensure these styled components are defined
import * as deeplab from "@tensorflow-models/deeplab";

export const ImageSegmentation = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [modelNameSelect, setModelNameSelect] = useState("pascal"); // Default model
  const fileInputRef = useRef();
  const imageRef = useRef();
  const [imgData, setImgData] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);

  const loadModel = async (modelName) => {
    try {
      setLoading(true);
      const loadedModel = await deeplab.load({
        base: modelName,
        quantizationBytes: 2,
      });
      setModel(loadedModel);
      console.log("Model loaded:", loadedModel);
    } catch (error) {
      console.error("Error loading model:", error);
      alert("Failed to load model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSegmentation = async (imageElement) => {
    if (!model) {
      console.error("Model not loaded");
      alert("Please load the model first.");
      return;
    }
    const segmentation = await model.segment(imageElement);
    renderPrediction(segmentation, imageElement);
    console.log("Segmentation:", segmentation);
  };

  const renderPrediction = (segmentation, imageElement) => {
    const { segmentationMap, width, height } = segmentation;

    // Create a canvas element to overlay on the selected image
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Draw segmentation map on the canvas
    const ctx = canvas.getContext("2d");

    // Set colors for different segments (assuming a simple color map)
    // Generate dynamic colors for unique classes
    const generateColor = (classIndex) => {
      const hue = (classIndex * 360) / 21; // Adjust for your number of classes (21 is just an example)
      return `hsl(${hue}, 100%, 50%, 0.8)`; // 50% lightness and 50% transparency
    };
    // HSL to RGB conversion function
    const hslToRgb = (h, s, l) => {
      let r, g, b;
      if (s === 0) {
        // Achromatic
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };
    // Draw each pixel's color based on the segmentation map
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < segmentationMap.length; i++) {
      const classIndex = segmentationMap[i];
      const color = generateColor(classIndex);
      const rgba = color.match(/\d+/g); // Extract HSL values and convert to RGB
      const [h, s, l] = rgba.map(Number);

      // Convert HSL to RGB
      const [r, g, b] = hslToRgb(h, s, l);

      imageData.data[i * 4 + 0] = r; // R
      imageData.data[i * 4 + 1] = g; // G
      imageData.data[i * 4 + 2] = b; // B
      imageData.data[i * 4 + 3] = 128; // A (50% opacity)
    }

    const segmentationMapData = new ImageData(segmentationMap, width, height);
    ctx.putImageData(segmentationMapData, 0, 0);

    // Use the canvas as a URL
    setCanvasRef(canvas.toDataURL());
    // Revoke the object URL after using it
    URL.revokeObjectURL(canvas);
  };

  const onSelectImage = async (e) => {
    setIsRecognizing(true);
    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImgData(imgData);
    const imageElement = new Image();
    imageElement.src = imgData;

    imageElement.onload = async () => {
      await handleSegmentation(imageElement);
      setIsRecognizing(false);
    };
  };

  const readImage = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = () => reject(fileReader.error);
      fileReader.readAsDataURL(file);
    });
  };
  // style={{ position: "relative", display: "inline-block" }}
  return (
    <div>
      <DetectionContainer>
        {imgData && <TargetImg src={imgData} alt="Selected" ref={imageRef} />}
        {canvasRef && (
          <img
            src={canvasRef}
            alt="Segmentation Overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none", // This allows clicks to go through the canvas
            }}
          />
        )}
      </DetectionContainer>
      <div>
        <select
          name="modelNameSelect"
          id="modelNameSelect"
          value={modelNameSelect}
          onChange={(e) => setModelNameSelect(e.target.value)}
        >
          <option value="pascal">Pascal</option>
          <option value="cityscapes">City Scapes</option>
          <option value="ade20k">ADE20K</option>
        </select>
        <button id="loadModel" onClick={() => loadModel(modelNameSelect)}>
          {isLoading
            ? `Loading...  ${modelNameSelect}`
            : `(${modelNameSelect}) Loaded Model`}
        </button>
        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={onSelectImage}
        />
        <SelectButton onClick={openFilePicker} disabled={isRecognizing}>
          {isRecognizing ? "Recognizing..." : "Select Image"}
        </SelectButton>
      </div>
    </div>
  );
};

export default ImageSegmentation;
