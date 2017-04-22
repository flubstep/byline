import React, { Component } from 'react';
import _ from 'lodash';

import { FirebasePageStore } from './store/firebase';
import { UserStore } from './store/user';

import './App.css';

import Loading from './containers/Loading';
import Page from './containers/Page';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: null,
      pageState: null
    }
  }

  componentDidMount() {
    this.store = new FirebasePageStore('testpage');
    this.user = new UserStore(this.store);
    this.store.on('value', this.handleStoreUpdate);
    this.user.on('value', this.handleUserUpdate);
  }

  componentWillUnmount() {
    this.store.off('value', this.handleStoreUpdate);
  }

  handleUserUpdate = (user) => {
    this.setState({ user });
  }

  handleStoreUpdate = (store) => {
    this.setState({ pageState: store.val() });
  }

  render() {
    if (_.isNil(this.state.pageState) || _.isNil(this.state.user)) {
      return <Loading />
    } else {
      return (
        <Page
          store={this.store}
          user={this.state.user}
          {...this.state.pageState}
          />
      );
    }
  }
}

export default App;
