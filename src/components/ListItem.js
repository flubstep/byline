import React, { Component } from 'react'

import './ListItem.css'

export default class ListItem extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {

    }
  }

  render() {
    return (
      <div
        className="ListItem"
        onMouseDown={this.props.onDragStart}
        onTouchStart={this.props.onDragStart}
        >
        { this.props.children }
      </div>
    )
  }
}