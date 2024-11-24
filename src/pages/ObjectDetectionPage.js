import MotionHoc from "./MotionHoc";
import styled from "styled-components";
import {ObjectDetector} from '../components/objectDetector/objectDetector';
import { ObjectDetection } from "face-api.js";

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
      <h1>Extract the text from image</h1>
      <div>
      <AppContainer/>
        <ObjectDetector />
      </div>
    </>
    );
  }

  const OcrPage = MotionHoc(ObjectDetectionComponent);

  export default ObjectDetection;
