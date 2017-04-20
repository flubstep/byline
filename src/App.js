import React, { Component } from 'react';
import './App.css';

import ShuffleList from './components/ShuffleList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ShuffleList />
      </div>
    );
  }
}

export default App;
