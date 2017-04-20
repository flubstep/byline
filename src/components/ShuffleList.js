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
  { key: 'one', text: 'One uno eins yi' },
  { key: 'two', text: 'Two dos zwei er' },
  { key: 'three', text: 'Three tres drei san' },
  { key: 'four', text: 'Four quattro vier si' }
];

export default class ShuffleList extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      dragStartPosition: null,
      dragPosition: null,
      dragItem: null,
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
    this.setState({
      dragItem: item,
      dragItemIndex: index,
      dragStartOffset: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
      dragStartPosition: [e.pageX, e.pageY],
      dragPosition: [e.pageX, e.pageY]
    });
    e.preventDefault();
    window.addEventListener('mousemove', this.dragItemMove);
    window.addEventListener('mouseup', this.dragItemEnd);
  }

  dragItemMove = (e) => {
    if (this.state.dragItem) {
      this.setState({
        dragPosition: [e.pageX, e.pageY]
      });
    }
  }

  dragItemEnd = (e) => {
    // todo: drop?
    let items = this.state.items;
    if (!_.isNil(this.state.dropzoneIndex)) {
      let dropIndex = this.state.dropzoneIndex;
      if (dropIndex > this.state.dragItemIndex) {
        dropIndex -= 1;
      }
      items = items.filter(item => item.key !== this.state.dragItem.key);
      items.splice(dropIndex, 0, this.state.dragItem);
    }
    this.setState({
      items: items,
      dropzoneIndex: null,
      dragItem: null,
      dragItemIndex: null,
      dragStartOffset: null,
      dragStartPosition: null,
      dragPosition: null
    });
    window.removeEventListener('mousemove', this.dragItemMove);
    window.removeEventListener('mouseup', this.dragItemEnd);
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
      return (
        <div>
          <div className={'rule' + activeCls} />
          <div
            className={'dropzone' + activeCls}
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
              opacity: this.state.dragItem && item.key === this.state.dragItem.key ? 0.1 : 1,
              transition: 'opacity 0.2s ease-in-out'
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
                position: 'absolute',
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