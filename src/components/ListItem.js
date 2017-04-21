import React, { Component } from 'react'

import './ListItem.css'

export default class ListItem extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      pointerDown: false
    }
    this.dragTimeout = null;
  }

  onPointerDown = (e) => {
    this.setState({ pointerDown: true });
    window.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('touchend', this.onPointerUp)
    e.persist();
    this.dragTimeout = setTimeout(
      () => this.maybeDragStart(e),
      this.props.holdTimeout
    );
  }

  onPointerUp = (e) => {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
      if (this.props.onClick) {
        this.props.onClick();
      }
    }
    if (this.state.pointerDown) {
      this.setState({ pointerDown: false });
      window.removeEventListener('mouseup', this.onPointerUp);
      window.removeEventListener('touchend', this.onPointerUp);
    }
  }

  maybeDragStart = (e) => {
    this.dragTimeout = null;
    if (this.state.pointerDown) {
      // Treat it as pointer is up because the event now
      // belongs to the parent element.
      this.onPointerUp();
      if (this.props.onDragStart) {
        this.props.onDragStart(e);
      }
    }
  }

  render() {
    return (
      <div
        className="ListItem"
        onMouseDown={this.onPointerDown}
        onTouchStart={this.onPointerDown}
        >
        { this.props.text }
        <span>

        </span>
      </div>
    )
  }
}

ListItem.defaultProps = {
  holdTimeout: 300
};
