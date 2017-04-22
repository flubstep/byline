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
    this.userId = new UserStore().getCurrentUser().id;
  }

  componentDidMount() {
    this.store = new FirebasePageStore(this.props.page);
    this.store.on('value', this.handleStoreUpdate);
  }

  componentWillUnmount() {
    this.store.off('value', this.handleStoreUpdate);
  }

  handleStoreUpdate = (store) => {
    let pageState = store.val();
    let user = pageState ? pageState.users[this.userId] : null;
    this.setState({
      pageState,
      user
    });
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
