import React, { Component } from 'react';
import debounce from 'lodash.debounce';

const defaultOffset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

function isFunction(any) {
  return typeof any === 'function';
}

function isInViewport(
  element,
  options = { offset: defaultOffset, threshold: 0 }
) {
  const {
    top,
    right,
    bottom,
    left,
    width,
    height
  } = element.getBoundingClientRect();

  const intersection = {
    t: bottom,
    r: window.innerWidth - left,
    b: window.innerHeight - top,
    l: right
  };

  const threshold = {
    x: options.threshold * width,
    y: options.threshold * height
  };

  return (
    intersection.t > options.offset.top + threshold.y &&
    intersection.r > options.offset.right + threshold.x &&
    intersection.b > options.offset.bottom + threshold.y &&
    intersection.l > options.offset.left + threshold.x
  );
}

export default class LazyImage extends Component {
  state = {
    trigger: ['scroll', 'resize'],
    inViewport: false,
    loaded: false
  };

  componentDidMount() {
    const handler = debounce(this.triggerHandler.bind(this), 100, {
      leading: false,
      trailing: true,
      maxWait: 2000
    });
    this.state.trigger.forEach(event => {
      addEventListener(event, handler, false);
    });
    handler(this.__container);
    this.__handler = handler;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { onEnter, onLeave } = nextProps;
    // enter the viewport
    if (nextState.inViewport === true && this.state.inViewport === false) {
      isFunction(onEnter) && onEnter(this);
    } else if (
      nextState.inViewport === false &&
      this.state.inViewport === true
    ) {
      // leave the viewport
      isFunction(onLeave) && onLeave(this);
    }
    return true;
  }

  componentWillUnmount() {
    const handler = this.__handler;
    this.state.trigger.forEach(event => {
      removeEventListener(event, handler, false);
    });
    handler && isFunction(handler.cancle) && handler.cancel();
  }

  triggerHandler() {
    if (this.__container && isInViewport(this.__container)) {
      this.setState({ inViewport: true, loaded: true });
    } else {
      this.setState({ inViewport: false });
    }
  }

  render() {
    const { src } = this.props;
    const { loaded } = this.state;
    return (
      <div
        style={{ display: 'inline-block' }}
        className="react-img-lazy-load-container"
        ref={dom => (this.__container = dom)}
      >
        {src && loaded
          ? <img ref={dom => (this.__img = dom)} {...this.props} />
          : ''}
      </div>
    );
  }
}
