// https://www.robinwieruch.de/styled-components/

import styled, { css } from "styled-components";

const CaptureButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 20px;

  &:hover {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
`;

const SelectButton = styled.button`
  padding: 15px;

  /* border: 2px solid transparent; */
  background-color: #008000;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  //margin-top: 2em;
  margin-left: 4em;
  cursor: pointer;
  transition: all 260ms ease-in-out;
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 10px;

  &:hover {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
`;

const DetectionContainer = styled.div`
  min-width: 200px;
  height: 400px;
  border: 3px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
const TargetImg = styled.img`
  height: 100%;
`;

const TargetBox = styled.div`
  position: absolute;

  left: ${({ x }) => x + "px"};
  top: ${({ y }) => y + "px"};
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};

  border: 4px solid #1ac71a;
  background-color: transparent;
  z-index: 20;

  &::before {
    content: "${({ classType, score }) => `${classType} ${score.toFixed(1)}%`}";
    color: #1ac71a;
    font-weight: 500;
    font-size: 17px;
    position: absolute;
    top: -1.5em;
    left: -5px;
  }
`;

const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export {
  ObjectDetectorContainer,
  SelectButton,
  CaptureButton,
  HiddenFileInput,
  TargetImg,
  DetectionContainer,
  TargetBox,
};
