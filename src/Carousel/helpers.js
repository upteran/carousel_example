export const mouseEvents = [
  {
    event: "mouseleave",
    handler: "handleOnMouseUp"
  },
  {
    event: "mouseup",
    handler: "handleOnMouseUp"
  },
  {
    event: "mousemove",
    handler: "handleOnMouseMove"
  }
];

/**
 * Cap a value at a minimum value and a maximum value.
 * @param  {number} min The smallest allowed value.
 * @param  {number} max The largest allowed value.
 * @param  {number} x   A value.
 * @return {number}     Either the original value, the minimum value, or the maximum value.
 */
export const boundedRange = ({ min, max, x }) =>
  Math.min(max, Math.max(min, x));
