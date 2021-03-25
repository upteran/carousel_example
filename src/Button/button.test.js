/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";
import Button from "./index";
import RippleButton from "./RippleButton/index";
import styles from "./styles.scss";

describe("Button", () => {
  test("should be defined", () => {
    expect(Button).toBeDefined();
  });

  test("should render correctly width classes default and md ", () => {
    const wrapper = renderer.create(<Button />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

  test("should render label and child input if type === file", () => {
    const wrapper = shallow(<Button type="file" />);
    expect(wrapper.type()).toEqual("label");
    expect(wrapper.children().type()).toEqual("input");
  });

  test("should change width to 100% if get prop fullWidth", () => {
    const wrapper = shallow(<Button fullWidth />);
    wrapper.debug();
    expect(wrapper.find("button").hasClass(styles.fullWidth)).toBe(true);
  });

  test("floated class", () => {
    const floatedDir = "left";
    const wrapper = mount(<Button floated={floatedDir} />);
    expect(wrapper.find("button").hasClass(styles[`${floatedDir}Float`])).toBe(
      true
    );
  });

  test("circle class", () => {
    const wrapper = mount(<Button circle />);
    expect(wrapper.find("button").hasClass(styles.circle)).toBe(true);
  });

  test("size class select", () => {
    const sizes = ["sm", "md", "lg"];
    sizes.forEach((size) => {
      const wrapper = mount(<Button size={size} />);
      expect(wrapper.find("button").hasClass(styles[size])).toBe(true);
    });
  });

  test("color class select", () => {
    const colors = ["default", "gold", "transparent", "gray"];
    colors.forEach((color) => {
      const wrapper = mount(<Button color={color} />);
      expect(wrapper.find("button").hasClass(styles[color])).toBe(true);
    });
  });

  test('should"t click if button is disabled', () => {
    const mockFn = jest.fn();
    const mockFn2 = jest.fn();
    const wrapper = shallow(<Button onClick={mockFn} disabled />);
    wrapper.find("button").simulate("click", {
      preventDefault: mockFn2
    });
    expect(mockFn.mock.calls.length).toEqual(0);
    expect(mockFn2.mock.calls.length).toEqual(1);
  });

  test('change tag to "a" if component get param "href"', () => {
    const wrapper = shallow(<Button href="some href" />);
    expect(wrapper.type()).toEqual("a");
  });

  test('should render tag "a" if pass props "tag" === a', () => {
    const wrapper = shallow(<Button tag="a" />);
    expect(wrapper.type()).toEqual("a");
  });

  test('should render default tag "button" if props "tag" not passed', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper.type()).toEqual("button");
  });

  test("should call mock function when button is clicked", () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Button ripple={false} onClick={mockFn} />);
    wrapper.find("button").simulate("click");
    expect(mockFn.mock.calls.length).toEqual(1);
  });

  test("should call mock function when ripple is enabled", () => {
    const mockFn = jest.fn();
    const wrapper = shallow(<Button ripple onClick={mockFn} />);
    wrapper.find("button").simulate("click", {
      target: {
        getBoundingClientRect: () => ({
          width: 10
        })
      },
      nativeEvent: {
        offsetY: 100,
        offsetX: 200
      }
    });
    expect(wrapper.state("ripplePos")).toEqual({
      width: expect.any(Number),
      height: expect.any(Number),
      top: expect.any(String),
      left: expect.any(String)
    });
  });

  test("clear timer on unmounting", () => {
    jest.useFakeTimers();
    const wrapper = mount(<RippleButton />);
    wrapper.instance().timer = 123;
    wrapper.unmount();
    expect(clearTimeout).toBeCalled();
  });
});
