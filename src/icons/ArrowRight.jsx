import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "./SvgIcon";

export const ArrowRight = (props) => (
  <SvgIcon
    {...props}
    viewBox="0 0 10 15"
    classes={[props.classes, "svg-icon-ArrowRight"]}
  >
    <defs>
      <polygon
        id="arrowright-a"
        points="841.763 4809 847.5 4814.725 853.237 4809 855 4810.762 847.5 4818.262 840 4810.762"
      />
    </defs>
    <g fillRule="evenodd" transform="translate(-843 -4806)">
      <use
        fillRule="nonzero"
        transform="rotate(-90 847.5 4813.5)"
        xlinkHref="#arrowright-a"
      />
    </g>
  </SvgIcon>
);

ArrowRight.displayName = `ArrowRight`;

ArrowRight.propTypes = {
  // eslint-disable-next-line react/require-default-props
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default ArrowRight;
