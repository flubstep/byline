import React, { Component } from 'react'
import ProfileCircle from './ProfileCircle';

import FaHeart from 'react-icons/lib/fa/heart';
import FaSmile from 'react-icons/lib/fa/smile-o';

import './ListItem.css'

export default class ListItem extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      pointerDown: false
    }
    this.dragTimeout = null;
  }

  onMouseMove = (e) => {
    e.preventDefault();
  }

  onPointerDown = (e) => {
    this.setState({ pointerDown: true });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onPointerUp);
    window.addEventListener('touchend', this.onPointerUp)
    e.persist();
    this.dragTimeout = setTimeout(
      () => this.maybeDragStart(e),
      this.props.holdTimeout
    );
  }

  onPointerUp = (e) => {
    let shouldFireClick = false;
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
      shouldFireClick = !!this.props.onClick;
    }
    if (this.state.pointerDown) {
      this.setState({
        pointerDown: false
      }, () => {
        if (shouldFireClick) {
          this.props.onClick()
        }
      });
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onPointerUp);
      window.removeEventListener('touchend', this.onPointerUp);
    } else {
      if (shouldFireClick) {
        this.props.onClick();
      }
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

  onLike = (e) => {
    e.stopPropagation();
    this.props.onLike(e);
  }

  onLove = (e) => {
    e.stopPropagation();
    this.props.onLove(e);
  }

  render() {
    return (
      <div className="ListItem">
        <div className="author">
          <ProfileCircle user={this.props.author} />
        </div>
        <div className="text-container"
          onMouseDown={this.onPointerDown}
          onTouchStart={this.onPointerDown}
          >
          { this.props.text }
        </div>
        <span className="emoji">
          <span className="action-icon">
            <FaHeart onMouseDown={this.onLove} />
          </span>
          <span className="action-icon">
            <FaSmile onMouseDown={this.onLike} />
          </span>
        </span>
      </div>
    )
  }
}

ListItem.defaultProps = {
  holdTimeout: 200,
  onLike: () => {},
  onLove: () => {}
};
