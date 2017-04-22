import React, { Component } from 'react';
import _ from 'lodash';

import { COLOR_OPTIONS, ICON_OPTIONS } from '../store/user';

import './UserSettings.css';

class SettingsModal extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      active: this.props.active,
      animationCls: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active && !nextProps.active) {
      // Begin animating out and wait 200ms before actually deactivating
      this.setState({
        animationCls: 'animate-out'
      });
      setTimeout(() => this.setState({
        animationCls: '',
        active: false
      }), 200);
    } else if (!this.props.active && nextProps.active) {
      this.setState({
        animationCls: '',
        active: true
      });
    }
  }

  setColor = (color) => {
    this.props.store.updateUserInfo({ color });
  }

  setIcon = (icon) => {
    this.props.store.updateUserInfo({ icon });
  }

  onNameChange = (e) => {
    this.props.store.updateUserInfo({ name: e.target.value });
  }

  render() {
    if (!this.state.active) {
      return null;
    }
    return (
      <div className={'SettingsModal ' + this.state.animationCls}>
        <h2>Color</h2>
        <div className="color-options">
          { COLOR_OPTIONS.map(hex => (
            <div
              key={hex}
              className={
                'color-option' +
                (hex === this.props.user.color ? ' selected' : '')
              }
              style={{ backgroundColor: hex }}
              onClick={() => this.setColor(hex)}
            />
          ))}
        </div>
        <h2>Symbol</h2>
        <div className="icon-options">
          { _.toPairs(ICON_OPTIONS).map(([name, IconCls]) => (
            <div
              key={name}
              className={
                'icon-option' +
                (name === this.props.user.icon ? ' selected' : '')
              }
              onClick={() => this.setIcon(name)}
              >
              <IconCls fill="white" size={20} />
            </div>
          ))}
        </div>
        <h2>Name (Optional)</h2>
        <div className="name">
          <input
            placeholder="君の名は"
            value={this.props.user.name}
            onChange={this.onNameChange}
            />
        </div>
      </div>
    );
  }
}

export default class UserSettings extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      modalActive: false
    };
  }

  showModal = () => {
    this.setState({ modalActive: true });
    window.addEventListener('click', this.hideModal);
  }

  hideModal = () => {
    this.setState({ modalActive: false });
    window.removeEventListener('click', this.hideModal);
  }

  toggleModal = (e) => {
    if (this.state.modalActive) {
      this.hideModal();
    } else {
      this.showModal();
    }
  }

  render() {
    const IconCls = ICON_OPTIONS[this.props.user.icon];
    return (
      <div className="UserSettings" onClick={(e) => e.stopPropagation()}>
        <div
          className="user-icon"
          style={{
            backgroundColor: this.props.user.color
          }}
          onClick={this.toggleModal}
          >
          <IconCls fill="white" size={24} />
        </div>
        <div className="description">Edit Profile</div>
        <SettingsModal active={this.state.modalActive} {...this.props} />
      </div>
    )
  }
}
