import React, { Component } from 'react';
import _ from 'lodash';
import ListItem from './ListItem';
import AddListItem from './AddListItem';

import './ShuffleList.css';

const DragStates = {
  DOWN: 'down',
  MOVING: 'moving'
};

const MOCK_ITEMS = [
  { key: 'one', text: 'This is just a test of the draggable item interface' },
  { key: 'two', text: 'The results that are added are not saved anywhere' },
  { key: 'three', text: 'Going to just leave this here as a test though' },
  { key: 'four', text: 'Firebase integration is coming next' }
];

export default class ShuffleList extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dragStartPosition: null,
      dragPosition: null,
      dragItem: null,
      dragItemHeight: null,
      dragItemIndex: null,
      items: MOCK_ITEMS,
      loading: true
    };
  }

  addItem = (newItem) => {
    this.setState({
      items: this.state.items.concat([newItem])
    });
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
      dragStartPosition: [e.pageX, e.pageY],
      dragPosition: [mousePos.pageX, mousePos.pageY]
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
        dragPosition: [mousePos.pageX, mousePos.pageY]
      });
    }
  }

  dragItemEnd = (e) => {
    e.stopPropagation();
    let items = this.state.items;
    if (!_.isNil(this.state.dropzoneIndex)) {
      let dropIndex = this.state.dropzoneIndex;
      if (dropIndex > this.state.dragItemIndex) {
        dropIndex -= 1;
      }
      items = items.filter(item => item.key !== this.state.dragItem.key);
      items.splice(dropIndex, 0, this.state.dragItem);
    }
    // TODO: this state is getting gross
    this.setState({
      items: items,
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

  render() {
    return (
      <div className="ShuffleList">
        {
          this.state.items.map((item, index) => (
            <div key={item.key} style={{
              opacity: this.state.dragItem && item.key === this.state.dragItem.key ? 0.1 : 1
            }}>
              { this.renderDropzone(index) }
              <ListItem onDragStart={(e) => this.dragItemStart(e, item, index)}>
                <span className="item-text">{ item.text }</span>
              </ListItem>
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
              <ListItem>
                <span className="item-text">{ this.state.dragItem.text }</span>
              </ListItem>
            </div>
          ) : null
        }
        { this.renderDropzone(this.state.items.length) }
        <AddListItem onSubmit={this.addItem} />
      </div>
    );
  }
}