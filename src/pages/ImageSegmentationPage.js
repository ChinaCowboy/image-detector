import MotionHoc from "./MotionHoc";
import styled from "styled-components";
import ImageSegmentation from "../components/imageSegmentation/ImageSegmentation";
import Counter from "../components/imageSegmentation/ImageSegmentation2";

import React, { useState, Component } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const ImageSegmentationComponent = () => {
  const [count, setCount] = useState(0);
  const [randomValue, setRandomValue] = useState(Math.random());

  const increment = () => {
    setCount(count + 1);
  };

  const changeRandomValue = () => {
    setRandomValue(Math.random()); // This will cause a re-render
  };
  return (
    <>
      <h1>Image Segmentation</h1>
      <ErrorBoundary>
        <ImageSegmentation />
      </ErrorBoundary>
    </>
  );
};

const ObjectDetectionPage = MotionHoc(ImageSegmentationComponent);

export default ObjectDetectionPage;
