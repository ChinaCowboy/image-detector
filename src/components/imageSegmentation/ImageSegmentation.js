import React, { useState, useRef } from "react";
import {
  StyledSelect,
  SelectButton,
  HiddenFileInput,
  TargetImg,
  DetectionContainer,
  LoadingOverlay,
  TargetSegImg,
} from "../style"; // Ensure these styled components are defined
import * as deeplab from "@tensorflow-models/deeplab";

export const ImageSegmentation = () => {
  const [model, setModel] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [modelNameSelect, setModelNameSelect] = useState("pascal"); // Default model
  const [showOptions, setShowOptions] = useState(false);

  const [objectColors, setObjectColors] = useState({});

  const models = ["pascal", "cityscapes", "ade20k"];

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
    const { legend, segmentationMap, width, height } = segmentation;

    displayLegends(legend);
    // Create a canvas element to overlay on the selected image
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Draw segmentation map on the canvas
    const ctx = canvas.getContext("2d");

    // Draw each pixel's color based on the segmentation map
    console.log("segmentationMap", segmentationMap);
    for (let i = 0; i < segmentationMap.length; i += 4) {
      segmentationMap[i + 3] = 160; // Set alpha channel for transparency
    }

    const segmentationMapData = new ImageData(segmentationMap, width, height);
    ctx.putImageData(segmentationMapData, 0, 0);

    // Use the canvas as a URL
    setCanvasRef(canvas.toDataURL());
    // Revoke the object URL after using it
    URL.revokeObjectURL(canvas);
  };

  const displayLegends = (legendObj) => {
    const legendsDiv = document.getElementById("legends");
    const legendLabel = document.getElementById("legendLabel");

    // Clear previous legends
    legendsDiv.innerHTML = "";

    // Populate legends
    Object.keys(legendObj).forEach((legend) => {
      const [red, green, blue] = legendObj[legend];
      const span = document.createElement("span");
      span.innerHTML = legend;
      span.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
      span.style.padding = "10px";
      span.style.marginRight = "10px";
      span.style.color = "#ffffff";
      span.onclick = storeObjectColor; // Ensure storeObjectColor is defined

      legendsDiv.appendChild(span);
    });

    // Make the legend label and the legends visible
    legendLabel.style.visibility = "visible";
    legendsDiv.style.visibility = "visible";
  };

  const storeObjectColor = (e) => {
    const target = e.target || e.srcElement;
    const objectName = target.textContent;
    const objectColor = window.getComputedStyle(target).backgroundColor;

    // Convert the obtained color to a number array
    const colorArray = objectColor
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map(Number);

    // Update the objectColors state
    setObjectColors((prevColors) => ({
      ...prevColors,
      [objectName]: colorArray,
    }));

    // Highlight the selected legend
    target.style.border = "5px solid green";
  };

  const onSelectImage = async (e) => {
    setIsRecognizing(true);
    const file = e.target.files[0];
    // Check if a file was selected and if it's an image
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      setIsRecognizing(false);
      return;
    }
    try {
      const imgData = await readImage(file);
      setImgData(imgData);
      const imageElement = new Image();
      imageElement.src = imgData;

      imageElement.onload = async () => {
        await handleSegmentation(imageElement);
        setIsRecognizing(false);
      };
    } catch (error) {
      console.error("Error reading image:", error);
      alert("Failed to read the image. Please try again.");
      setIsRecognizing(false);
    }
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
      <DetectionContainer
        style={{ position: "relative", display: "inline-block" }}
      >
        {imgData && <TargetImg src={imgData} alt="Selected" ref={imageRef} />}
        {canvasRef && (
          <TargetSegImg
            src={canvasRef}
            alt="Segmentation Overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        )}
        {/* Loading Overlay */}
        <LoadingOverlay visible={isLoading}>
          Loading Model...{modelNameSelect}
        </LoadingOverlay>
        <label id="legendLabel" style={{ visibility: "hidden" }}>
          Legend
        </label>
        <div id="legends" style={{ visibility: "hidden" }}></div>
      </DetectionContainer>
      <div>
        {/* Custom Dropdown for Model Selection */}
        <StyledSelect>
          <div
            className="custom-select"
            onClick={() => setShowOptions(!showOptions)}
          >
            {modelNameSelect}
          </div>
          {showOptions && (
            <div className="dropdown-options">
              {models.map((model) => (
                <div
                  key={model}
                  className="option"
                  onClick={() => {
                    setModelNameSelect(model);
                    setShowOptions(false);
                    loadModel(model); // Load the model on selection
                  }}
                >
                  {model.charAt(0).toUpperCase() + model.slice(1)}{" "}
                  {/* Capitalize the first letter */}
                </div>
              ))}
            </div>
          )}
        </StyledSelect>

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
