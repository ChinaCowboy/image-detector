
import { Route, Routes, useLocation } from "react-router";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Team from "./pages/Team";
import ImageDetectorPage from "./pages/ImageDetectorPage";
import Documents from "./pages/Documents";
import Projects from "./pages/Projects";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";



const Pages = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: calc(2rem + 2vw);
    background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

function App() {
  const location = useLocation();
  return (
      <>
      <Sidebar/>
      <Pages>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/imagedetector" element={<ImageDetectorPage />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </AnimatePresence>
      </Pages>
    </>
  );
}

export default App;
