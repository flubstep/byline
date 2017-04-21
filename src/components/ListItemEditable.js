import React, { Component } from 'react';

import './ListItemEditable.css';

export default class ListItemEditable extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.text
    }
  }

  componentDidMount() {
    this.refs.input.focus();
  }

  onChange = (e) => {
    this.setState({ text: e.target.value });
  }

  render() {
    return (
      <div className="ListItemEditable">
        <input
          ref="input"
          autofocus={true}
          value={this.state.text}
          onChange={this.onChange}
          onBlur={() => this.props.onComplete(this.state.text)}
        />
      </div>
    )
  }
}