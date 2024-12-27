import MotionHoc from "./MotionHoc";
import styled from "styled-components";
import { ObjectDetector } from "../components/objectDetector/objectDetector";
import CameraDetector from "../components/objectDetector/CameraDetector";
import LinearTensorFlow from "../components/objectDetector/LinearTensorFlow";
import { PolynormalRefression } from "../components/objectDetector/PolynormalRefression";
import { Toxicity } from "../components/objectDetector/Toxicity";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2d60a0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #951010;
`;

const ObjectDetectionComponent = () => {
  return (
    <>
      <h1>Detect the object from the image (still have bug )</h1>
      <div>
        <AppContainer />
        {/* <Toxicity /> */}
        <LinearTensorFlow />
        {/* <CameraDetector /> */}
      </div>
    </>
  );
};

const ObjectDetectionPage = MotionHoc(ObjectDetectionComponent);

export default ObjectDetectionPage;
