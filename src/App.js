import React, { Component } from 'react';
import { Circle } from 'react-shapes';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import Pipe from './Pipe';

const birdRadius = 20;

export default class App extends Component {

  getInitialPipes() {
    const count = 3;
    const pipes = [];
    for (let i = 1; i < count; i++) {
      const x = window.innerWidth + (window.innerWidth / i);
      pipes.push({
        upperPipeHeight: (window.innerHeight / 2) - (Math.random() * 200),
        bottomPipeHeight: (window.innerHeight / 2) - (Math.random() * 200),
        x: x
      })
    }
    return pipes;
  }

  constructor(props) {
    super(props);
    this.state = {
      birdHeight: window.innerHeight / 2,
      left: 350,
      gravity: 0.8,
      velocity: 0,
      pipes: this.getInitialPipes(),
      pipeSpeed: 7
    }
    this.moveUp = this.moveUp.bind(this)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.update(), 15);
  }

  update() {
    const birdCrashed = this.state.birdHeight > window.innerHeight - birdRadius * 2;
    if(birdCrashed){
      clearInterval(this.interval);
      return;
    }

    const pipeWasHit = this.state.pipes.find(pipe => pipe.isHit)

    if(pipeWasHit){
      clearInterval(this.interval);
      return;
    }

    const newVelocity = (this.state.velocity + this.state.gravity) * 0.9;
    const birdHeight = newVelocity + this.state.birdHeight;
    const newPipes = this.state.pipes.map(pipe => {
      const newX = pipe.x - this.state.pipeSpeed
      if (newX < 0) {
        return {
          upperPipeHeight: (window.innerHeight / 2) - (Math.random() * 200),
          bottomPipeHeight: (window.innerHeight / 2) - (Math.random() * 200),
          x: window.innerWidth - 40
        }
      } else {
        let isHit = false;
        const xDifference = (this.state.left - pipe.x)
        const hitOnX = xDifference < 10 && xDifference > 0;
        const hitOnUpperY = birdHeight < pipe.upperPipeHeight;
        const hitOnLowerY = birdHeight + birdRadius > (window.innerHeight - pipe.bottomPipeHeight)
        if ((hitOnUpperY || hitOnLowerY) && hitOnX) {
          isHit = true
        }

        return {
          ...pipe,
          x: newX,
          isHit: isHit
        }
      }
    })
    this.setState({
      velocity: newVelocity,
      birdHeight: birdHeight,
      pipes: newPipes
    })
  }

  moveUp(e) {
    this.setState({
      velocity: this.state.velocity - 25
    })
  }

  render() {
    const left = this.state.left;
    const birdHeight = this.state.birdHeight;
    return (
      <div className="App" >
        <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={this.moveUp} />
        <div style={{ left: left, top: birdHeight, position: 'absolute' }}>
          <Circle r={birdRadius} fill={{ color: '#2409ba' }} stroke={{ color: '#E65243' }} strokeWidth={3} />
        </div>
        {this.state.pipes.map(pipe => {
          const upperPipeHeight = pipe.upperPipeHeight;
          const x = pipe.x;

          const bottomPipeTop = window.innerHeight - pipe.bottomPipeHeight;
          const bottomPipeHeight = pipe.bottomPipeHeight;

          return <Pipe key={x} isHit={pipe.isHit} upperPipeHeight={upperPipeHeight} bottomPipeHeight={bottomPipeHeight} x={x} bottomPipeTop={bottomPipeTop} />
        })}
      </div>
    );
  }
}
