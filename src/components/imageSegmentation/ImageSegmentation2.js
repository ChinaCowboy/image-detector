import React, { PureComponent } from "react";

class Counter extends PureComponent {
  render() {
    console.log("Counter rendered");
    return <h1>{this.props.count}</h1>;
  }
}

export default Counter;

export const ImageSegmentation = React.memo(({ count }) => {
  console.log("Counter rendered");
  return <h1>{count}</h1>;
});
