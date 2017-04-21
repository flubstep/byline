import React, { Component } from 'react';
import FaTasks from 'react-icons/lib/fa/tasks';

import './Loading.css';

export default class Loading extends Component {

  render() {
    return (
      <div className="Loading">
        <div className="icon-container">
          <FaTasks size={24} />
        </div>
      </div>
    )
  }
}