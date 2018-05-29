// @flow
import React, { Component } from 'react';

import type { CopilotContext } from '../types';

type Props = {
  name: string,
  text: string,
  order: number,
  _copilot: CopilotContext,
  children: React$Element,
  touchCallBack?: any
};

class ConnectedCopilotStep extends Component<Props> {
  componentDidMount() {
    this.props._copilot.registerStep({
      name: this.props.name,
      text: this.props.text,
      order: this.props.order,
      target: this,
      wrapper: this.wrapper,
      touchCallBack: this.props.touchCallBack
    });
  }

  componentWillUnmount() {
    this.props._copilot.unregisterStep(this.props.name);
  }

  setNativeProps(obj) {
    this.wrapper.setNativeProps(obj);
  }

  measure() {
    if (typeof __TEST__ !== 'undefined' && __TEST__) { // eslint-disable-line no-undef
      return new Promise(resolve => resolve({
        x: 0, y: 0, width: 0, height: 0,
      }));
    }

    return new Promise((resolve, reject) => {
      const measure = () => {
        // Wait until the wrapper element appears
        if (this.wrapper && this.wrapper.measure) {
          this.wrapper.measure(
            (ox, oy, width, height, x, y) => resolve({
              x, y, width, height,
            }),
            reject,
          );
        } else {
          requestAnimationFrame(measure);
        }
      };

      requestAnimationFrame(measure);
    });
  }

  render() {
    const copilot = {
      ref: (wrapper) => { this.wrapper = wrapper; },
      onLayout: () => { }, // Android hack
    };

    return React.cloneElement(this.props.children, { copilot });
  }
}

export default ConnectedCopilotStep;
