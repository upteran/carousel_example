import React, { memo } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
// import Link from 'components/Link';
// import { GridContainer, HeaderTitle } from '@bb/bb-uikit';

import styles from "./styles.module.scss";

/** Компонент отображающий заголовок для секции, где слева находится заголовок а справа любой допустимый блок */
export const SectionHeader = memo(
  ({
    title,
    rightSideSlot,
    containerFluid,
    // linkRoute,
    // linkParams,
    // linkText,
    wrapClass
  }) => (
    <div fluid={containerFluid}>
      <div className={cx(wrapClass, styles.sectionHeader)}>
        <div className={styles.leftSide}>
          <h2>{title}</h2>
        </div>
        <div className={styles.rightSide}>
          <div>{rightSideSlot}</div>
        </div>
      </div>
    </div>
  ),
  (prevProps, nextProps) => prevProps.rightSideSlot === nextProps.rightSideSlot
);

SectionHeader.propTypes = {
  /** Заголовок секции */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** контент в правом краю */
  rightSideSlot: PropTypes.element,
  /** Фиксированная или растянутая по родительскому контейнеру ширина контейнера сетки */
  containerFluid: PropTypes.bool,
  /** Доп ссылка на страницу сайта */
  linkRoute: PropTypes.string,
  /** Параметры ссылки */
  linkParams: PropTypes.objectOf(PropTypes.any),
  /** Текст ссылки */
  linkText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** Дополнительные классы для обертки компонента */
  wrapClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

SectionHeader.defaultProps = {
  title: "",
  rightSideSlot: null,
  containerFluid: false,
  linkRoute: null,
  linkParams: {},
  linkText: "",
  wrapClass: ""
};
