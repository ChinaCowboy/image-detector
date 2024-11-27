import MotionHoc from "./MotionHoc";
import OcrComponent from "../components/ocrDetector/ocrDetectorWithoutPond";

const ProjectsComponent = () => {
  return <h1>Projects</h1>;
};

const Projects = MotionHoc(OcrComponent);

export default Projects;
