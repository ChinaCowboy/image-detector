import React from "react";
import OcrComponent from "./ocrDetector";
import OcrComponent2 from "./ocrDetectorWithoutPond";

const ocrDetectorWrapper = () => {
  return (
    <div>
      <OcrComponent />
      <OcrComponent2 />
    </div>
  );
};

export default ocrDetectorWrapper;
