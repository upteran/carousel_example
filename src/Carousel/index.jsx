import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Button from "../Button";
import { ArrowLeft } from "../icons/ArrowLeft";
import { ArrowRight } from "../icons/ArrowRight";
import { SectionHeader } from "./SectionHeader";

import { mouseEvents, boundedRange } from "./helpers";
import styles from "./styles.module.scss";

const SITE_PC = true;

/** Компонент отображает touch/drag карусель с возможностью отображать заголовок
 * workflow:
 *
 * Компонент принимает массив элементов, который помещает в карусель, ширина каждлого слайда регулируется
 * в компоненте контейнере, сама карусель никак не изменяет ширину, устанавливается только шаг карусели по переданному
 * параметру slideSize
 *
 * Для того чтобы задать отступы внутри слайдов и визуально разделить их, в компоненте слайда необходимо добавить свойство
 * paddingRight: Number, и установленное значение передать в параметре slidePadding, тем самым общая длина слайдера будет снивелированна на этот отступ
 * и будет пересчитано количество выводимых слайдов, по дефолту значение paddingRight === 0
 *
 * Для включения адаптивности используется параметр responsive, который добавляет слушателя на событие resize, и при изменении ширины
 * окна запускает callback getSlideWidth, который можно использовать для пересчета ширины слайдов
 * */
class SectionTouchCarousel extends Component {
  static slideSizeInPx(sliderTrayWidth, totalSlides) {
    return sliderTrayWidth / totalSlides;
  }

  /* @param {Number} threshold
     @param {Number} deltaX - user mosue move on X axios
     @param {Number} slideSizeInPx 
     @param {Number} dragStep 
     @param {Number} thresholdWidth
     @param {Number} showedSlides 
  */
  static slidesMoved(
    threshold,
    deltaX,
    slideSizeInPx,
    dragStep,
    thresholdWidth,
    showedSlides
  ) {
    const delta = deltaX;
    const bigDrag = Math.abs(Math.round(delta / thresholdWidth));
    const stepValue = dragStep || showedSlides;
    const smallDrag =
      Math.abs(delta) >= thresholdWidth * threshold ? stepValue : 0;
    const moved = Math.max(smallDrag, bigDrag);
    if (delta < 0) {
      return moved;
    }
    const retval = -moved;
    return retval === 0 ? 0 : retval; // get rid of -0
  }

  static propTypes = {
    /** total slides count */
    totalSlides: PropTypes.number.isRequired,
    /** slide move step  */
    dragStep: PropTypes.number,
    /** slides */
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.any.isRequired,
    /** section header title props */
    titleProps: PropTypes.shape({
      /** container component prop fluid  */
      containerFluid: PropTypes.bool,
      /** заголовок блока */
      sectionTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    }),
    /** callback events
     * onTouchMove, onMouseMove, onMouseDown, onMouseUp
     * */
    trayProps: PropTypes.objectOf(PropTypes.any),
    /** (sliderSize * moveThreshold) */
    moveThreshold: PropTypes.number,
    /** onResize listener on and change slides with dynamically */
    responsive: PropTypes.bool,
    /** callback debounce */
    debounceTime: PropTypes.number,
    /** constant slide with || use with getSlideWidth callback  */
    slideSize: PropTypes.number,
    /** cb that trigger on component mount and fires fn that calc slide with from parent component  */
    getSlideWidth: PropTypes.func,
    carouselLinkProps: PropTypes.shape({
      /** block link */
      linkRoute: PropTypes.string,
      /** link route params */
      linkParams: PropTypes.objectOf(PropTypes.any),
      /** link text */
      linkText: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    }),
    /** slide padding for wright calc common container width */
    slidePadding: PropTypes.number,
    /** mouse move distance trigger slide change */
    thresholdWidth: PropTypes.number,
    /** fn return slides count */
    getSlidesCount: PropTypes.func
  };

  static defaultProps = {
    dragStep: 1,
    moveThreshold: 0.1,
    trayProps: {},
    titleProps: {
      containerFluid: false,
      sectionTitle: null
    },
    responsive: true,
    debounceTime: 500,
    slideSize: 0,
    getSlideWidth: null,
    carouselLinkProps: {
      linkRoute: null,
      linkParams: {},
      linkText: ""
    },
    slidePadding: 0,
    thresholdWidth: 160,
    getSlidesCount: null
  };

  constructor(props) {
    super(props);

    const { totalSlides } = props;
    this.state = {
      containerWidth: 0,
      deltaX: 0,
      startX: 0,
      startY: 0,
      showedSlides: 0,
      isBeingMouseDragged: false,
      currentSlide: 0,
      isAnimatedTray: true,
      trayWidth: 0,
      showArrows: false,
      sliderLength: totalSlides // add to check prev total slide length and next
    };

    this.moveTimer = null;
    this.resizeTimer = null;
  }

  componentDidMount() {
    if (!SITE_PC) return;
    const { responsive, getSlideWidth } = this.props;
    if (getSlideWidth) getSlideWidth();
    mouseEvents.forEach((item) => {
      document.documentElement.addEventListener(
        item.event,
        this[item.handler],
        false
      );
    });

    if (responsive) {
      window.addEventListener("resize", this.debounceResizeListener, false);
    }

    this.setState({
      containerWidth: this.trayContainer.clientWidth
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.sliderLength !== nextProps.totalSlides) {
      const nextTrayWidth = nextProps.slideSize * nextProps.totalSlides;
      return {
        trayWidth: nextTrayWidth,
        sliderLength: nextProps.totalSlides,
        showArrows: prevState.showedSlides < nextProps.totalSlides
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { slideSize, totalSlides } = this.props;
    const { containerWidth } = this.state;
    if (
      prevProps.slideSize !== slideSize ||
      containerWidth !== prevState.containerWidth
    ) {
      const showedSlides = this.getShowedSlides(slideSize);
      const trayWidth = slideSize * totalSlides;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        trayWidth,
        showedSlides: Math.floor(showedSlides),
        showArrows: Math.floor(showedSlides) < totalSlides
      });
    }
  }

  componentWillUnmount() {
    const { responsive } = this.props;
    mouseEvents.forEach((item) => {
      document.documentElement.removeEventListener(
        item.event,
        this[item.handler],
        false
      );
    });
    this.moveTimer = null;
    if (responsive) {
      window.removeEventListener("resize", this.debounceResizeListener, false);
    }
  }

  debounceResizeListener = () => {
    const { debounceTime } = this.props;
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(this.changeSlideWidth, debounceTime);
  };

  changeSlideWidth = () => {
    const { getSlideWidth } = this.props;
    const { containerWidth } = this.state;
    if (getSlideWidth) getSlideWidth();
    if (
      this.trayContainer &&
      this.trayContainer.clientWidth !== containerWidth
    ) {
      this.setState({ containerWidth: this.trayContainer.clientWidth });
    }
  };

  getShowedSlides = (slideWidth) => {
    const { slidePadding, getSlidesCount } = this.props;
    const showedSlides =
      (this.trayContainer.clientWidth + slidePadding) / slideWidth;
    if (getSlidesCount) getSlidesCount(showedSlides);
    return showedSlides; // add padding because it's will remove in computeMaxMove calc
  };

  onDragStart = ({ screenX, mouseDrag = false, screenY }) => {
    window.cancelAnimationFrame.call(window, this.moveTimer);
    this.setState({
      isBeingMouseDragged: mouseDrag,
      startX: screenX,
      startY: screenY
    });
  };

  onDragMove = ({ screenX, screenY }) => {
    const { moveThreshold } = this.props;
    const { startX: startXCord, startY } = this.state;
    const deltaY = Math.abs(startY - screenY);
    const deltaX = Math.abs(startXCord - screenX);
    if (deltaX < moveThreshold || deltaY > deltaX) return; // cancel move tray if mouse delta change < moveThreshold
    this.moveTimer = window.requestAnimationFrame.call(window, () => {
      this.setState(
        ({ isBeingMouseDragged, isAnimatedTray, startX }) =>
          !(!isBeingMouseDragged && isAnimatedTray) && {
            deltaX: screenX - startX,
            isAnimatedTray: false
          }
      );
    });
  };

  onDragEnd = () => {
    const { totalSlides } = this.props;
    const { showedSlides } = this.state;
    window.cancelAnimationFrame.call(window, this.moveTimer);
    if (totalSlides > showedSlides) {
      this.computeCurrentSlide();
    }
    this.setState({
      isBeingMouseDragged: false,
      startX: 0,
      deltaX: 0,
      isAnimatedTray: true
    });
  };

  handleOnMouseDown = (e) => {
    e.preventDefault();
    this.onDragStart({
      screenX: e.screenX,
      mouseDrag: true
    });
    this.callCallback("onMouseDown", e);
  };

  handleOnMouseMove = (e) => {
    const { isBeingMouseDragged } = this.state;
    if (!isBeingMouseDragged) return;
    this.onDragMove({
      screenX: e.screenX
    });
    this.callCallback("onMouseMove", e);
  };

  handleOnMouseUp = (e) => {
    e.preventDefault();
    this.onDragEnd();
    this.callCallback("onMouseUp", e);
  };

  computeCurrentSlide = () => {
    const { totalSlides, dragStep, moveThreshold, thresholdWidth } = this.props;
    const { deltaX, currentSlide: prevSlide, showedSlides } = this.state;
    const slideSizeInPx = SectionTouchCarousel.slideSizeInPx(
      this.tray.clientWidth,
      totalSlides
    );
    const slidesMoved = SectionTouchCarousel.slidesMoved(
      moveThreshold,
      deltaX,
      slideSizeInPx,
      dragStep,
      thresholdWidth,
      showedSlides
    );

    const currentSlide = boundedRange({
      min: 0,
      max: totalSlides - showedSlides,
      x: prevSlide + slidesMoved
    });

    this.setState({
      currentSlide
    });
  };

  moveTo = (nextSlide) =>
    this.setState({
      currentSlide: nextSlide
    });

  onMoveBtnClickHandler = (num) => () => {
    const { totalSlides } = this.props;
    const { currentSlide, showedSlides } = this.state;
    const nextSlideIndex = currentSlide + num;
    let nextSlide = nextSlideIndex;

    if (nextSlideIndex > totalSlides || Math.abs(nextSlideIndex) < 0) {
      nextSlide = currentSlide;
    } else if (nextSlide > totalSlides - showedSlides) {
      nextSlide = totalSlides - showedSlides;
    } else if (nextSlideIndex < 0) {
      nextSlide = 0;
    }

    this.moveTo(nextSlide);
  };

  computeMaxMove = (transitionX) => {
    const { totalSlides, slidePadding } = this.props;
    const { showedSlides, trayWidth, containerWidth } = this.state;
    if (totalSlides <= showedSlides) return 0;
    const maxMove = trayWidth - containerWidth;
    return Math.abs(transitionX) > maxMove
      ? -maxMove + slidePadding
      : transitionX;
  };

  emptyRender = () => <div style={{ display: "none" }} />;

  callCallback(propName, ev) {
    const { trayProps } = this.props;
    if (trayProps && typeof trayProps[propName] === "function") {
      trayProps[propName](ev);
    }
  }

  render() {
    const {
      children,
      totalSlides,
      titleProps,
      slideSize,
      carouselLinkProps,
      dragStep
    } = this.props;
    const { containerFluid, sectionTitle } = titleProps;
    const {
      currentSlide,
      deltaX,
      isAnimatedTray,
      trayWidth,
      showedSlides,
      showArrows
    } = this.state;
    const transitionX = currentSlide * slideSize * -1;
    const maxTransX = this.computeMaxMove(transitionX);
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide === totalSlides - showedSlides;
    const stepValue = dragStep || showedSlides;
    return (
      <div className={styles.sectionCarousel}>
        <SectionHeader
          {...carouselLinkProps}
          containerFluid={containerFluid}
          title={sectionTitle}
          rightSideSlot={
            showArrows ? (
              <div className={styles.arrowsBtnGroup}>
                <Button
                  disabled={isFirstSlide}
                  color="transparent"
                  onClick={this.onMoveBtnClickHandler(-stepValue)}
                  classes={styles.arrowLeft}
                >
                  <ArrowLeft width="10" height="16" color="inherit" />
                </Button>
                <Button
                  color="transparent"
                  disabled={isLastSlide}
                  onClick={this.onMoveBtnClickHandler(stepValue)}
                  classes={styles.arrowRight}
                >
                  <ArrowRight width="10" height="16" color="inherit" />
                </Button>
              </div>
            ) : null
          }
        />
        <div
          fluid={containerFluid}
          style={{ width: "700px", margin: "0 auto" }}
        >
          {SITE_PC ? (
            <div
              aria-live="polite"
              className={cx(styles.sliderOuter)}
              ref={(e) => {
                this.trayContainer = e;
              }}
            >
              <div
                role="presentation"
                onMouseDown={this.handleOnMouseDown}
                ref={(el) => {
                  this.tray = el;
                }}
                className={cx(styles.carouselList, {
                  [styles.isAnimatedTray]: isAnimatedTray
                })}
                style={{
                  WebkitTransform: `translate3d(${maxTransX}px, 0, 0) translateX(${deltaX}px)`,
                  transform: `translate3d(${maxTransX}px, 0, 0) translateX(${deltaX}px)`,
                  width: `${trayWidth}px`
                }}
              >
                {children}
              </div>
            </div>
          ) : (
            <div className={styles.scroll}>
              <CustomScrollbar
                autoHeight
                autoHeightMin={100}
                autoHeightMax={500}
                renderThumbHorizontal={this.emptyRender}
                renderTrackHorizontal={this.emptyRender}
              >
                <div className={styles.scrollContent}>{children}</div>
              </CustomScrollbar>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SectionTouchCarousel;
