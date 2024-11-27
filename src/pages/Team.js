import MotionHoc from "./MotionHoc";
import OcrComponent from "../components/ocrDetector/ocrDetectorWithoutPond";

const TeamComponent = () => {
  return <h1>Team</h1>;
};

const Team = MotionHoc(OcrComponent);

export default Team;
