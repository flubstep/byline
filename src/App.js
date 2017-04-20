import React, { Component } from 'react';
import './App.css';

import ShuffleList from './components/ShuffleList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>An ordered list</h1>
        <ShuffleList />
      </div>
    );
  }
}

export default App;
