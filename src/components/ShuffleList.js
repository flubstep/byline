import React, { Component } from 'react';
import _ from 'lodash';

import ListItem from './ListItem';
import ListItemEditable from './ListItemEditable';
import AddListItem from './AddListItem';

import './ShuffleList.css';

export default class ShuffleList extends Component {

  constructor(props, context) {
    super(props, context);
    // TODO: State is getting really large. Move to redux possibly?
    this.state = {
      dragStartPosition: null,
      dragPosition: null,
      dragItem: null,
      dragItemHeight: null,
      dragItemIndex: null,
      editingItemKey: null,
      loading: true
    };
  }

  addItem = (newItem) => {
    this.props.store.addItem(newItem);
  }

  dragItemStart = (e, item, index) => {
    let mousePos = e.touches ? _.last(e.touches) : e;
    let dragStart = e.nativeEvent;
    let rect = e.target.getBoundingClientRect();
    if (_.isNil(dragStart.offsetX)) {
      let x = e.targetTouches[0].pageX - rect.left;
      let y = e.targetTouches[0].pageY - rect.top;
      dragStart = {
        offsetX: x,
        offsetY: y
      };
    }
    let dragItemHeight = Math.abs(rect.bottom - rect.top);
    this.setState({
      dragItem: item,
      dragItemHeight: dragItemHeight,
      dragItemIndex: index,
      dragStartOffset: [dragStart.offsetX, dragStart.offsetY],
      dragStartPosition: [e.clientX, e.clientY],
      dragPosition: [mousePos.clientX, mousePos.clientY]
    });
    e.stopPropagation();
    e.preventDefault();
    window.addEventListener('mousemove', this.dragItemMove);
    window.addEventListener('touchmove', this.dragItemMove);
    window.addEventListener('mouseup', this.dragItemEnd);
    window.addEventListener('touchend', this.dragItemEnd);
  }

  dragItemMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let mousePos = e.touches ? _.last(e.touches) : e;
    if (this.state.dragItem) {
      this.setState({
        dragPosition: [mousePos.clientX, mousePos.clientY]
      });
    }
  }

  dragItemEnd = (e) => {
    e.stopPropagation();
    if (!_.isNil(this.state.dropzoneIndex)) {
      this.props.store.moveItem(this.state.dragItem, this.state.dropzoneIndex);
    }
    // TODO: this state is getting gross
    this.setState({
      dropzoneIndex: null,
      dragItem: null,
      dragItemHeight: null,
      dragItemIndex: null,
      dragStartOffset: null,
      dragStartPosition: null,
      dragPosition: null
    });
    window.removeEventListener('mousemove', this.dragItemMove);
    window.removeEventListener('touchmove', this.dragItemMove);
    window.removeEventListener('mouseup', this.dragItemEnd);
    window.removeEventListener('touchend', this.dragItemEnd);
  }

  dropzoneOver = (index) => {
    if (this.state.dragItem) {
      if (index !== this.state.dragItemIndex && index !== this.state.dragItemIndex + 1) {
        this.setState({
          dropzoneIndex: index
        });
      }
    }
  }

  dropzoneOut = () => {
    if (this.state.dragItem) {
      this.setState({
        dropzoneIndex: null
      });
    }
  }

  renderDropzone(index) {
    // TODO: Make <Dropzone> its own component with 'onDrop'
    if (this.state.dragItem) {
      let activeCls = (index === this.state.dropzoneIndex ? ' active' : '');
      let activeStyle = activeCls ? {
        height: 36 + this.state.dragItemHeight,
        transform: `translateY(-${18 + this.state.dragItemHeight}px)`
      } : {};
      return (
        <div>
          <div className={'rule' + activeCls}/>
          <div
            className={'dropzone' + activeCls}
            style={activeStyle}
            onMouseOver={() => this.dropzoneOver(index)}
            onMouseOut={this.dropzoneOut}
            >
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  updateText = (updatedItem, text) => {
    this.props.store.updateItem({ ...updatedItem, text });
    this.setState({
      editingItemKey: null
    });
  }

  startEditing = (item) => {
    this.setState({ editingItemKey: item.key });
  }

  stopEditing = () => {
    this.setState({ editingItemKey: null });
  }

  render() {
    return (
      <div className="ShuffleList">
        {
          this.props.items.map((item, index) => (
            <div key={item.key} style={{
              opacity: this.state.dragItem && item.key === this.state.dragItem.key ? 0.1 : 1
            }}>
              { this.renderDropzone(index) }
              {
                item.key === this.state.editingItemKey ? (
                  <ListItemEditable
                    author={this.props.users[item.author]}
                    text={item.text}
                    onComplete={text => this.updateText(item, text)}
                  />
                ) : (
                  <ListItem
                    author={this.props.users[item.author]}
                    text={item.text}
                    onDragStart={(e) => this.dragItemStart(e, item, index)}
                    onClick={(e) => this.startEditing(item)}
                    onLike={() => console.log('like!')}
                  />
                )
              }
            </div>
          ))
        }
        {
          this.state.dragItem ? (
            <div
              className="drag-item"
              style={{
                position: 'fixed',
                top: this.state.dragPosition[1] - this.state.dragStartOffset[1],
                left: this.state.dragPosition[0] - this.state.dragStartOffset[0],
                pointerEvents: 'none'
              }}
            >
              <ListItem text={this.state.dragItem.text} />
            </div>
          ) : null
        }
        { this.renderDropzone(this.props.items.length) }
        <AddListItem user={this.props.user} onSubmit={this.addItem} />
      </div>
    );
  }
}

ShuffleList.defaultProps = {
  items: []
};
