// Daniel Shiffman
// Polynomial Regression with TensorFlow.js

// https://thecodingtrain.com/CodingChallenges/105-polynomial-regression-tfjs.htmll
// https://youtu.be/tIXDik5SGsI

import p5 from "p5";
import * as tf from "@tensorflow/tfjs";
import { ObjectDetectorContainer } from "../style";

import React, { useEffect, useRef, useState } from "react";

export const PolynormalRefression = () => {
  const myRef = useRef(null);

  function sketch(p) {
    p.setup = () => {
      p.createCanvas(400, 400);
      a = tf.variable(tf.scalar(p.random(-1, 1)));
      b = tf.variable(tf.scalar(p.random(-1, 1)));
      c = tf.variable(tf.scalar(p.random(-1, 1)));
      d = tf.variable(tf.scalar(p.random(-1, 1)));
    };

    p.mousePressed = () => {
      dragging = true;
    };

    p.mouseReleased = () => {
      dragging = false;
    };

    p.draw = () => {
      if (dragging) {
        let x = p.map(p.mouseX, 0, p.width, -1, 1);
        let y = p.map(p.mouseY, 0, p.height, 1, -1);
        x_vals.push(x);
        y_vals.push(y);
      } else {
        tf.tidy(() => {
          if (x_vals.length > 0) {
            const ys = tf.tensor1d(y_vals);
            optimizer.minimize(() => loss(predict(x_vals), ys));
          }
        });
      }

      p.background(0);

      p.stroke(255);
      p.strokeWeight(8);
      for (let i = 0; i < x_vals.length; i++) {
        let px = p.map(x_vals[i], -1, 1, 0, p.width);
        let py = p.map(y_vals[i], -1, 1, p.height, 0);
        p.point(px, py);
      }

      const curveX = [];
      for (let x = -1; x <= 1; x += 0.05) {
        curveX.push(x);
      }

      const ys = tf.tidy(() => predict(curveX));
      let curveY = ys.dataSync();
      ys.dispose();

      p.beginShape();
      p.noFill();
      p.stroke(255);
      p.strokeWeight(2);
      for (let i = 0; i < curveX.length; i++) {
        let x = p.map(curveX[i], -1, 1, 0, p.width);
        let y = p.map(curveY[i], -1, 1, p.height, 0);
        p.vertex(x, y);
      }
      p.endShape();
    };
  }
  useEffect(() => {
    // On component creation, instantiate a p5 object with the sketch and container reference
    const p5Instance = new p5(sketch, myRef.current);

    // On component destruction, delete the p5 instance
    return () => {
      p5Instance.remove();
    };
  }, []);

  let x_vals = [];
  let y_vals = [];

  let a, b, c, d;
  let dragging = false;

  const learningRate = 0.2;
  const optimizer = tf.train.adam(learningRate);

  function loss(pred, labels) {
    return pred.sub(labels).square().mean();
  }

  function predict(x) {
    const xs = tf.tensor1d(x);
    // y = ax^3 + bx^2 + cx + d
    const ys = xs
      .pow(tf.scalar(3))
      .mul(a)
      .add(xs.square().mul(b))
      .add(xs.mul(c))
      .add(d);
    return ys;
  }
  return (
    <ObjectDetectorContainer>
      <h1>Linear regression with TensorFlow</h1>
      <div ref={myRef}></div>
    </ObjectDetectorContainer>
  );
  // console.log(tf.memory().numTensors);
};
