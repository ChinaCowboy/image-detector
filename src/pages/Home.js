import MotionHoc from "./MotionHoc";
import React, { useState,useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import README from '../About.md'


const HomeComponent = () => {
  const [about, setAbout] = useState('');

  useEffect (()=>{
    fetch(README)
    .then((response) => response.text())
    .then((text) => {
      setAbout(text)
      console.log(about);
    });
  },[]);

  return (
    // eslint-disable-next-line 
    <ReactMarkdown  children = {about} /> 
 );  

};


const Home = MotionHoc(HomeComponent);

export default Home;



