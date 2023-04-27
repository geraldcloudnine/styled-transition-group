import React from "react";
import renderer from "react-test-renderer";

import { css } from "styled-components";
import { CSSTransition } from "react-transition-group";
import transition from "../dist/bundle";
import localTransition from "../src";

const Tag = () => <div>Test</div>;

describe("CSSTransition", () => {
  it("should render", () => {
    const Component = localTransition(Tag);
    const tree = renderer.create(<Component timeout={100} hola={200} className="class" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
