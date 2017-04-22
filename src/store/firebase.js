import firebase from 'firebase';
import 'firebase/database';
import uuidV4 from 'uuid/v4';
import _ from 'lodash';

import { UserStore } from './user';

const config = {
  databaseURL: 'https://shuffle-d7424.firebaseio.com/'
};

firebase.initializeApp(config);

window.firebase = firebase;

export class FirebasePageStore {

  constructor(page) {
    this.userStore = new UserStore();
    this.userId = this.userStore.getCurrentUser().id;
    this.page = page;
    this.ref = firebase.database().ref(page);
    this.initialize();
  }

  getInitialState() {
    return {
      title: 'Your New Page',
      items: [],
      users: {}
    };
  }

  initialize() {
    this.ref.once('value', store => {
      // Don't actually care about the value, I just don't want
      // the transaction to fire until we actually connected
      this.ref.transaction(state => {
        let nextState = state;
        if (_.isNil(state)) {
          nextState = this.getInitialState()
        }
        // TODO: Should I keep users room specific or make it global?
        // Might be good to keep it separate for now in case privacy.
        let user = this.userStore.getCurrentUser();
        if (!nextState.users) {
          nextState.users = {};
        }
        nextState.users[user.id] = user;
        return nextState;
      });
    });
  }

  on(eventType, callback) {
    this.ref.on(eventType, callback);
  }

  off(eventType, callback) {
    this.ref.off(eventType, callback);
  }

  updateTitle(title) {
    this.ref.child('title').set(title);
  }

  addItem(item) {
    let newItem = {...item, key: uuidV4()};
    this.ref.child('items').transaction(state => {
      let items = state || [];
      return items.concat([newItem]);
    });
  }

  moveItem(item, toIndex) {
    this.ref.child('items').transaction(state => {
      let fromIndex = _.findIndex(state, i => i.key === item.key);
      if (fromIndex < 0) {
        console.warn('Attempting to move an item not found in the store.');
        return state;
      }
      if (toIndex > fromIndex) {
        // Done this weird way because of the way the dropzones work in the app.
        toIndex -= 1;
      }
      let newState = state.filter(i => i.key !== item.key);
      newState.splice(toIndex, 0, item);
      return newState;
    });
  }

  removeItem(item) {
    this.ref.child('items').transaction(state => {
      return state.filter(i => i.key !== item.key);
    });
  }

  updateItem(item) {
    if (!item.text) {
      this.removeItem(item);
    } else {
      this.ref.child('items').transaction(state => {
        return state.map(i => i.key === item.key ? item : i);
      });
    }
  }

  updateUserInfo(info) {
    this.userStore.update(info);
    this.ref.child('users').child(this.userId).transaction(state => {
      if (_.isNil(state)) {
        return info;
      } else {
        return {...state, ...info};
      }
    })
  }

  setUserInfo(info) {
    this.userStore.setCurrentUser(info);
    this.ref.child('users').child(this.userId).set(info);
  }
}
