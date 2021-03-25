import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./styles.module.scss";
// import * as TYPES from "../const/propsType";
import RippleButton from "./RippleButton";
// import { LoaderEllipsis } from "../LoaderEllipsis";

const tagType = {
  BUTTON: "button",
  LINK: "a"
};

/**
 * Компонент для отображения кнопки, возможны изменения размера, цвета в соответствии с дизайном.
 * Кнопка может быть отрисована тегом `<a />`, либо `<button />`, в зависимости от того, была ли передана ссылка для перехода к компоненту.
 * */

class Button extends Component {
  static propTypes = {
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

    /** Добавляет ссылку кнопке, в данном случае будет отрисован тег `<a />` вместо `<button />` */
    href: PropTypes.string,

    /** Дополнительные классы */
    classes: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),

    /** Цвет кнопки */
    // color: PropTypes.oneOf(TYPES.COLORS),

    /** Атрибут disable кнопки */
    disabled: PropTypes.bool,

    /** Добавляет свойство float */
    // floated: PropTypes.oneOf(TYPES.FLOATS),
    /** Растягивает кнопку на ширину контейнера */
    fullWidth: PropTypes.bool,
    onClick: PropTypes.func,
    /** Размер кнопки */
    size: PropTypes.oneOf(["md", "lg", "sm", "xlg"]),
    /** Задает кнопке круглую форму */
    circle: PropTypes.bool,
    /** Добавляет эффект ripple */
    ripple: PropTypes.bool,
    /** Текст либо элемент внутри кнопки */
    children: PropTypes.any, // eslint-disable-line
    /* loader на кнопке, для временного блокирования кнопки */
    loading: PropTypes.bool
  };

  static defaultProps = {
    tag: null,
    color: "default",
    disabled: false,
    fullWidth: false,
    size: "md",
    circle: false,
    ripple: true,
    onClick: null,
    loading: false
  };

  state = {
    ripplePos: null
  };

  onClick = (e) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }

    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (this.props.ripple) {
      const dx = e.target.getBoundingClientRect().width;
      const posY = e.nativeEvent.offsetY - dx / 2;
      const posX = e.nativeEvent.offsetX - dx / 2;
      const clickedStyle = {
        width: dx,
        height: dx,
        top: `${posY}px`,
        left: `${posX}px`
      };
      this.setState({ ripplePos: clickedStyle });
    }
  };

  render() {
    const {
      children,
      classes,
      color,
      disabled,
      floated,
      fullWidth,
      size,
      circle,
      onClick,
      ripple,
      tag,
      loading,
      ...attr
    } = this.props;

    const classNames = cx(
      classes,
      styles[color],
      styles[size],
      { [styles.circle]: circle },
      { [styles.fullWidth]: fullWidth },
      { [styles.disabled]: disabled },
      { [styles[`${floated}Float`]]: floated }
    );

    if (attr.type === "file") {
      return (
        // eslint-disable-next-line jsx-a11y/label-has-for
        <label className={cx(classNames, styles.uploadButton)}>
          {children}
          <input {...attr} disabled={disabled} />
        </label>
      );
    }

    const Tag = tag || attr.href ? tagType.LINK : tagType.BUTTON;

    return (
      <Tag
        {...attr}
        className={classNames}
        disabled={(disabled && Tag === "button") || undefined}
        onClick={this.onClick}
      >
        {ripple && !disabled && (
          <RippleButton ripplePos={this.state.ripplePos} />
        )}
        {/* {loading && (
          <div className={styles.loader}>
            <LoaderEllipsis />
          </div>
        )} */}
        {children}
      </Tag>
    );
  }
}

Button.displayName = "Button";

export default Button;
