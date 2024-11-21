import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import * as faceapi from 'face-api.js';
import { ObjectDetector } from "./components/objectDetector/objectDetector";
import FaceRecognition from './components/faceRecognition/FaceRecognition';


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


function App() {

  return (
    <AppContainer>
        <FaceRecognition/>
        <ObjectDetector />
    </AppContainer>

  );
}

export default App;
