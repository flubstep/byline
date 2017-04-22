import React, { Component } from 'react';

import ProfileCircle from './ProfileCircle';

import './ListItemEditable.css';

export default class ListItemEditable extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.text
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    switch (e.code) {
      case 'Backspace':
        if (this.state.text === '') {
          this.refs.input.blur()
        }
        break;
      case 'Enter':
        this.refs.input.blur();
        break;
      default:
        break;
    }
  }

  onChange = (e) => {
    this.setState({ text: e.target.value });
  }

  render() {
    return (
      <div className="ListItemEditable">
        <div className="author">
          <ProfileCircle user={this.props.author} />
        </div>
        <input
          ref="input"
          autoFocus={true}
          value={this.state.text}
          onChange={this.onChange}
          onBlur={() => this.props.onComplete(this.state.text)}
        />
      </div>
    )
  }
}