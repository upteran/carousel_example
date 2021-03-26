import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "./SvgIcon";

export const ArrowLeft = (props) => (
  <SvgIcon
    {...props}
    viewBox="0 0 10 15"
    classes={[props.classes, "svg-icon-ArrowLeft"]}
  >
    <defs>
      <polygon
        id="arrowleft-a"
        points="1037.763 4809 1043.5 4814.725 1049.237 4809 1051 4810.762 1043.5 4818.262 1036 4810.762"
      />
    </defs>
    <g fillRule="evenodd" transform="translate(-1038 -4806)">
      <use
        fillRule="nonzero"
        transform="rotate(90 1043.5 4813.5)"
        xlinkHref="#arrowleft-a"
      />
    </g>
  </SvgIcon>
);

ArrowLeft.displayName = `ArrowLeft`;

ArrowLeft.propTypes = {
  // eslint-disable-next-line react/require-default-props
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default ArrowLeft;
