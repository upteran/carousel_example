import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./styles.module.scss";

export const SvgIcon = ({
  classes,
  color,
  viewBox,
  onMouseEnter,
  onMouseLeave,
  hoverColor,
  children,
  ...attr
}) => {
  const classNames = cx(styles.svgIcon, classes);
  return (
    <svg className={classNames} viewBox={viewBox} {...attr}>
      {children}
    </svg>
  );
};

SvgIcon.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // eslint-disable-line react/require-default-props
  /**
   * Applies a color attribute to the SVG element.
   */
  color: PropTypes.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   */
  viewBox: PropTypes.string,
  onMouseLeave: PropTypes.func,
  onMouseEnter: PropTypes.func,
  hoverColor: PropTypes.string, // eslint-disable-line react/require-default-props
  height: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.any // eslint-disable-line
};

SvgIcon.defaultProps = {
  onMouseEnter: null,
  onMouseLeave: null,
  color: "#fff",
  height: "32",
  width: "32",
  viewBox: "0 0 32 32"
};
