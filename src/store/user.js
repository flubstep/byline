import _ from 'lodash';
import uuidV4 from 'uuid/v4';
import { EventEmitter } from 'events';

export const COLOR_OPTIONS = [
  '#f44336', // red 500
  '#e91e63', // pink 500
  '#9c27b0', // purple 500
  '#673ab7', // deep purple 500
  '#3f51b5', // indigo 500
  '#2196f3', // blue 500
  '#03a9f4', // light blue 500
  '#00bcd4', // cyan 500
  '#009688', // teal 500
  '#4caf50', // green 500
  '#8bc34a', // light green 500
  '#cddc39', // lime 500
  '#ffeb3b', // yellow 500
  '#ffc107', // amber 500
  '#ff9800', // orange 500
  '#ff5722', // deep orange 500
  '#795548', // brown 500
  '#9e9e9e', // grey 500
  '#607d8b' // blue grey 500
];

export const ICON_OPTIONS = {
  heart: require('react-icons/lib/fa/heart'),
  leaf: require('react-icons/lib/fa/leaf'),
  gamepad: require('react-icons/lib/fa/gamepad'),
  plug: require('react-icons/lib/fa/plug'),
  paw: require('react-icons/lib/fa/paw'),
  rocket: require('react-icons/lib/fa/rocket'),
  star: require('react-icons/lib/fa/star'),
  tree: require('react-icons/lib/fa/tree'),
  car: require('react-icons/lib/fa/automobile'),
  glass: require('react-icons/lib/fa/glass'),
  anchor: require('react-icons/lib/fa/anchor')
};

const randomColor = () => {
  const index = _.random(0, COLOR_OPTIONS.length);
  return COLOR_OPTIONS[index];
};

const randomIcon = () => {
  const keys = _.keys(ICON_OPTIONS);
  const index = _.random(0, keys.length);
  return keys[index];
}

export class UserStore {

  constructor(firebaseStore) {
    this.firebaseStore = firebaseStore;
    this.emitter = new EventEmitter();
    this.initialize();
  }

  getInitialState() {
    return {
      id: uuidV4(),
      name: '',
      icon: randomIcon(),
      color: randomColor()
    };
  }

  initialize() {
    let info = this.getCurrentUser();
    if (_.isNil(info)) {
      let initialInfo = this.getInitialState();
      this.setCurrentUser(initialInfo);
    }
  }

  on(event, callback) {
    this.emitter.addListener(event, callback);
    // Emit once to mirror the Firebase API
    callback(this.getCurrentUser());
  }

  off(event, callback) {
    this.emitter.removeListener(event, callback);
  }

  getCurrentUser() {
    let infoRaw = localStorage.getItem('userinfo');
    if (infoRaw) {
      try {
        return JSON.parse(infoRaw);
      } catch (err) {
        // Probably parse error
        localStorage.removeItem('userinfo');
        return null;
      }
    } else {
      return null;
    }
  }

  setCurrentUser(info) {
    localStorage.setItem('userinfo', JSON.stringify(info));
    if (this.firebaseStore) {
      this.firebaseStore.setUserInfo(info);
    }
    this.emitter.emit('value', info);
  }

  update(withValues) {
    let newInfo = {...this.getCurrentUser(), ...withValues};
    this.setCurrentUser(newInfo);
  }
};
