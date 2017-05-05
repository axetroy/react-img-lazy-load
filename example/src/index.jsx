import React, { Component } from 'react';
import { render } from 'react-dom';
import LazyImage from '../../lib/react-img-lazy-load';

class App extends Component {
  state = {};
  componentDidMount() {
    this.setState({
      src: 'https://avatars1.githubusercontent.com/u/9758711?v=3'
    });
    setTimeout(() => {
      this.setState({
        src: 'https://webpack.js.org/cd0bb358c45b584743d8ce4991777c42.svg'
      });
    }, 5000);
  }
  render() {
    const { src } = this.state;
    return (
      <div>
        <LazyImage
          src={src}
          width="200"
          height="300"
          onEnter={component => {
            console.log('enter viewport', component);
          }}
          onLeave={component => {
            console.info('leave viewport', component);
          }}
        />
        <div style={{ height: '2000px', backgroundColor: '#e3e3e3' }}>
          hello world
        </div>
        <LazyImage src={src} />
      </div>
    );
  }
}

const element = document.createElement('div');
document.body.appendChild(element);
render(<App />, element);
