import React, { Component } from 'react';

import ShuffleList from '../components/ShuffleList';
import UserSettings from '../components/UserSettings';

import './Page.css';

export default class Page extends Component {

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case 'Esc':
        e.preventDefault();
        this.refs.title.blur();
        break;
      default:
        break;
    }
  }

  updateTitle = (e) => {
    let newTitle = e.target.value;
    this.props.store.updateTitle(newTitle);
  }

  render() {
    return (
      <div className="Page">
        <input
          ref="title"
          className="page-title"
          onKeyDown={this.handleKeyDown}
          onChange={this.updateTitle}
          spellCheck={false}
          value={this.props.title}
          placeholder={'Untitled'}
        />
        <ShuffleList {...this.props} />
        <UserSettings {...this.props} />
      </div>
    )
  }
}