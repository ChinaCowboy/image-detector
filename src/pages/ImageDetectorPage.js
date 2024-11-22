import MotionHoc from "./MotionHoc";
import styled from "styled-components";
import ImageDetector from '../components/faceRecognition/FaceRecognition';
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

const ImageDetectorComponent = () => {
  return (
    <>      
      <h1>Image Detector</h1>
      <div>
      <AppContainer/>
        <ImageDetector />
      </div>
    </>
    );
  }

  const ImageDetectorPage = MotionHoc(ImageDetectorComponent);

  export default ImageDetectorPage;
