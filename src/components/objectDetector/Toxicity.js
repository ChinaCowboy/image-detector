import React, { useState, useEffect } from "react";
import * as toxicityClassifier from "@tensorflow-models/toxicity";

// https://github.com/FadyGrAb/TechNuggets/blob/main/05-Tensorflow-js-and-react/ai-moderator/src/components/UserText.js
export const Toxicity = () => {
  const [textToxicity, setTextToxicity] = useState([]);
  const [model, setModel] = useState(null);
  useEffect(() => {
    async function loadModel() {
      // "threshold" The the confidence interval for the classier.
      // Higher values = the model is more confident about its prediction.
      const threshold = 0.6;
      const toxicityModel = await toxicityClassifier.load(threshold);
      setModel(toxicityModel);
    }
    if (model === null) {
      // Only load the model if its current value is null
      loadModel();
    }
  }, [textToxicity, model]); // Watch the values for those and execute when changed.

  const predictToxicity = async (event) => {
    //const predictions = await model.classify([event.target.value]);
    model.classify([event.target.value]).then((predictions) => {
      // `predictions` is an array of objects, one for each prediction head,
      // that contains the raw probabilities for each input along with the
      // final prediction in `match` (either `true` or `false`).
      // If neither prediction exceeds the threshold, `match` is `null`.
      setTextToxicity(
        // Sets the "textToxicity" array
        // to the predictions after some filtering and mapping.
        // (console.log) the predictions to see
        // from where this came from.
        predictions
          .filter((item) => item.results[0].match === true)
          .map((item) => item.label)
      );
      console.log(predictions);
    });
  };
  return (
    <textarea
      className="center"
      onChange={predictToxicity}
      onBlur={predictToxicity}
      placeholder="Type here..."
    ></textarea>
  );
};
