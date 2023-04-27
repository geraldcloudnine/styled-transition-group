// __tests__/hidden-message.js
// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
import "@testing-library/jest-dom";
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import renderer from "react-test-renderer";
import transition from "../dist/bundle";

const text = "Test element";

const Tag = (props) => {
  return <div {...props}>{text}</div>;
};

describe("transition", () => {
  // it("wraps tag in CSSTransition", () => {
  //   const Component = transition(Tag)``;
  //   const tree = render(<Component timeout={100} />);
  //   // get component CSS transition
  //   const cssTransition = tree.getByTestId("css-transition");
  // });

  // it("passes props to child component", () => {
  //   const Component = transition(Tag)``;
  //   const tree = renderer.create(
  //     <Component timeout={100} foo bar />
  //   );
  //   console.log(tree.root.findByType(CSSTransition));
  //   const cssTransition = tree.root.findByType(CSSTransition);
  //   expect(tree.toJSON()).toMatchSnapshot();
  // });
  it("wraps tag in CSSTransition", () => {
    const Component = transition(Tag)``;
    const tree = renderer.create(<Component timeout={100} />);
    const cssTransition = tree.root.findByType(CSSTransition);
    const component = cssTransition.findByType(Tag);
    expect(cssTransition).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it("passes props to child component", () => {
    const Component = transition(Tag)``;
    const tree = renderer.create(<Component timeout={100} foo bar />);
    const cssTransition = tree.root.findByType(CSSTransition);
    const component = cssTransition.findByType(Tag);
    expect(Object.keys(cssTransition.props)).toContainEqual(
      "timeout",
      "classNames"
    );
    expect(Object.keys(component.props)).toContainEqual(
      "foo",
      "bar",
      "className"
    );
  });

  it("passes ref to child component", () => {
    const Component = transition.div``;
    class Wrapper extends React.Component {
      render() {
        return (
          <Component timeout={100} ref={(node) => (this.innerRef = node)} />
        );
      }
    }
    const tree = renderer.create(<Wrapper />);
    const ref = tree.root.findByType(Wrapper).instance.innerRef;
    expect(ref).toEqual(tree.root.findByType("div").instance);
  });

  it("omits transition props from children", () => {
    const Component = transition.div``;
    const tree = renderer.create(<Component in unmountOnExit timeout={100} />);
    const cssTransition = tree.root.findByType(CSSTransition);
    const component = cssTransition.findByType("div");
    expect(Object.keys(cssTransition.props)).toContainEqual(
      "timeout",
      "classNames",
      "unmountOnExit"
    );
    expect(Object.keys(component.props)).not.toContainEqual("unmountOnExit");
  });

  it("omits attrs transition props", () => {
    const Component = transition.div.attrs({})``;
    const tree = renderer.create(<Component in unmountOnExit timeout={100} />);
    const cssTransition = tree.root.findByType(CSSTransition);
    const component = cssTransition.findByType("div");
    expect(Object.keys(cssTransition.props)).toContainEqual(
      "timeout",
      "classNames",
      "unmountOnExit"
    );
    expect(Object.keys(component.props)).not.toContainEqual("unmountOnExit");
  });

  it("omits transition attrs", () => {
    const Component = transition.div.attrs({
      timeout: 100,
      unmountOnExit: true,
      onExit: () => "...",
    })``;
    const tree = renderer.create(<Component in />);
    const cssTransition = tree.root.findByType(CSSTransition);
    const component = cssTransition.findByType("div");
    expect(Object.keys(cssTransition.props)).toContainEqual(
      "timeout",
      "classNames",
      "unmountOnExit",
      "onExit"
    );
    expect(Object.keys(component.props)).not.toContainEqual(
      "in",
      "unmountOnExit",
      "onExit"
    );
  });

  it("works with css()", () => {
    const Component = transition.div(
      css`
        foo: red;
      `
    );
    const tree = renderer.create(<Component in timeout={100} />);
    const cssTransition = tree.root.findByType(CSSTransition);
    const component = cssTransition.findByType("div");
    expect(Object.keys(cssTransition.props)).toContainEqual(
      "timeout",
      "classNames",
      "unmountOnExit",
      "onExit"
    );
    expect(Object.keys(component.props)).not.toContainEqual(
      "in",
      "unmountOnExit",
      "onExit"
    );
    expect(Component.Target.componentStyle.rules).toHaveLength(1);
  });

  it("renders children callback", () => {
    const Component = transition.div``;
    const treeIn = renderer.create(
      <Component in timeout={100}>
        {(state) => <div data-testid="child">{state}</div>}
      </Component>
    );
    const treeOut = renderer.create(
      <Component in={false} timeout={100}>
        {(state) => <div data-testid="child">{state}</div>}
      </Component>
    );
    const cssTransitionIn = treeIn.root.findByType(CSSTransition);
    const cssTransitionOut = treeOut.root.findByType(CSSTransition);
    const componentIn = cssTransitionIn.findByType("div");
    const componentOut = cssTransitionOut.findByType("div");
    expect(componentIn.props.children.props.children).toContain("entered");
    expect(componentOut.props.children.props.children).toContain("exited");
  });
});
