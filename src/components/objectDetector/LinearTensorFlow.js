import Sketch from "react-p5";
import * as tf from "@tensorflow/tfjs";
import { ObjectDetectorContainer } from "../style";

import React, { useEffect, useRef, useState } from "react";
import { func } from "@tensorflow/tfjs-data";

export default function LinearTensorFlow() {
  const [optimizer, setOptimizer] = useState(null);

  useEffect(() => {
    // On component creation, instantiate a p5 object with the sketch and container reference
    // const p5Instance = new p5(sketch, myRef.current);
    const loadtoptimizer = tf.train.sgd(learningRate);
    setOptimizer(loadtoptimizer);
    // On component destruction, delete the p5 instance
    // return () => {
    //   p5Instance.remove();
    // };
  }, []);
  // const [x_vals, SetXs] = useState([0]);
  // const [y_vals, SetXy] = useState([0]);
  // const [m, SetM] = useState(tf.variable(tf.scalar(1)));
  // const [b, SetB] = useState(tf.variable(tf.scalar(1)));

  // y = a * x^2 + b * x + c.
  // const f = x => a.mul(x.square()).add(b.mul(x)).add(c);
  // const loss = (pred, label) => pred.sub(label).square().mean();
  const decay = 0.1;
  const momentum = 1;
  const epsilon = 0.5;

  const learningRate = 0.01;

  // const model = tf.sequential();
  // model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
  // model.compile({ optimizer: "sgd", loss: "meanAbsoluteError" });

  // const optimizer = tf.train.rmsprop(learningRate, decay, momentum, epsilon);
  //   const optimizer = tf.train.adam(learningRate);

  let bb = tf.scalar(Math.random()).variable();
  let mm = tf.scalar(Math.random()).variable();
  const myRef = useRef(null);
  let x_vals = [];
  let y_vals = [];

  const predict = (x) => tf.tensor1d(x).mul(mm).add(bb);

  //const predict = (x) => mm.mul(x).add(bb.mul(x)).add(bb);
  const loss = (pred, label) => pred.sub(label).square().mean();

  //myP5 = new p5(Sketch, myRef.current);
  // function sketch(p) {
  const mousePressed = (p) => {
    let x = p.map(p.mouseX, 0, p.width, 0, 1);
    let y = p.map(p.mouseY, 0, p.height, 1, 0);
    x_vals.push(x);
    // SetXs(x_vals);
    y_vals.push(y);
    // SetXy(y_vals);
  };

  const setup = (p, canvasParentRef) => {
    mm = tf.variable(tf.scalar(p.random(1)));
    bb = tf.variable(tf.scalar(p.random(1)));
    // SetM(m1);
    // SetB(b1);
    p.createCanvas(600, 800).parent(canvasParentRef);
    p.background(0);
  };

  const draw = (p) => {
    tf.tidy(() => {
      if (x_vals.length > 1) {
        const ys = tf.tensor1d(y_vals);
        optimizer.minimize(() => loss(predict(x_vals), ys));
        console.log(ys.dataSync());
      }
    });
    // await train();
    p.background(0);

    p.stroke(255);
    p.strokeWeight(8);
    for (let index = 0; index < x_vals.length; index++) {
      let px = p.map(x_vals[index], 0, 1, 0, p.width);
      let py = p.map(y_vals[index], 0, 1, p.height, 0);
      p.strokeWeight(6);
      p.point(px, py);
    }
    const xs = [0, 1];
    const ys = tf.tidy(() => predict(xs));
    let liney = ys.dataSync();
    ys.dispose();

    let x1 = p.map(xs[0], 0, 1, 0, p.width);
    let x2 = p.map(xs[1], 0, 1, 0, p.width);
    let y1 = p.map(liney[0], 0, 1, p.height, 0);
    let y2 = p.map(liney[1], 0, 1, p.height, 0);

    console.log(tf.memory().numTensors);
    p.line(x1, y1, x2, y2);
    //console.log(m);
  };

  const train = async () => {
    //await model.fit(tf.tensor1d(x_vals), tf.tensor1d(y_vals), { epochs: 10 });
  };
  return (
    <ObjectDetectorContainer>
      <Sketch setup={setup} mousePressed={mousePressed} draw={draw} />
      <h1>Linear regression with TensorFlow</h1>
      <button onClick={train}>train</button>
      <div ref={myRef}></div>
    </ObjectDetectorContainer>
  );
}
