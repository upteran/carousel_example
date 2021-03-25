import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

export default class RippleButton extends PureComponent {
  static displayName = "RippleButton";

  static propTypes = {
    ripplePos: PropTypes.objectOf(PropTypes.any)
  };

  static defaultProps = {
    ripplePos: null
  };

  state = {
    clicked: false,
    clickedStyle: null
  };

  componentDidUpdate(prevProps) {
    if (prevProps.ripplePos !== this.props.ripplePos) {
      this.rippling(this.props.ripplePos);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  rippling = (clickedStyle) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({ clicked: false, clickedStyle: {} });

    this.timer = setTimeout(() => {
      this.setState({ clicked: true, clickedStyle });
    });
  };

  render() {
    return (
      <span className={styles.wrap}>
        {this.state.clicked && (
          <span className={styles.circle} style={this.state.clickedStyle} />
        )}
      </span>
    );
  }
}
