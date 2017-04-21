import React, { Component } from 'react';

import { FirebasePageStore } from './store/firebase';

import './App.css';

import Loading from './containers/Loading';
import Page from './containers/Page';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      pageState: null
    }
  }

  componentDidMount() {
    this.store = new FirebasePageStore('testpage');
    this.store.on('value', this.handleStoreUpdate);
  }

  componentWillUnmount() {
    this.store.off('value', this.handleStoreUpdate);
  }

  handleStoreUpdate = (store) => {
    let pageState = store.val();
    this.setState({
      loading: false,
      pageState
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    } else {
      return (
        <Page
          store={this.store}
          {...this.state.pageState}
          />
      );
    }
  }
}

export default App;
