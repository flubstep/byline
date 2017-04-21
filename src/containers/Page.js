import React, { Component } from 'react';

import ShuffleList from '../components/ShuffleList';

import './Page.css';

export default class Page extends Component {

  render() {
    return (
      <div className="Page">
        <h1>{this.props.title}</h1>
        <ShuffleList
          store={this.props.store}
          items={this.props.items || []}
        />
      </div>
    )
  }
}