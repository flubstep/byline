import React, { Component } from 'react';

import ShuffleList from '../components/ShuffleList';
import UserSettings from '../components/UserSettings';

import './Page.css';

export default class Page extends Component {

  render() {
    return (
      <div className="Page">
        <h1>{this.props.title}</h1>
        <ShuffleList {...this.props} />
        <UserSettings {...this.props} />
      </div>
    )
  }
}