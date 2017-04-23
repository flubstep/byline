import React, { Component } from 'react';
import FaPencil from 'react-icons/lib/fa/pencil';
import uuidV4 from 'uuid/v4';

import ProfileCircle from './ProfileCircle';

import './AddListItem.css';

export default class AddListItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      inputValue: '',
      focused: false
    };
  }

  handleKeyDown = (e) => {
    switch (e.code) {
      case 'Enter':
        this.onSubmit();
        break;
      default:
        break;
    }
  }

  onFocus = () => {
    this.setState({ focused: true })
    window.addEventListener('keydown', this.handleKeyDown);
  }

  onBlur = () => {
    // HACK for mobile for now
    if (window.innerWidth <= 640) {
      this.onSubmit();
    }
    this.setState({ focused: false })
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  onSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (this.props.onSubmit) {
      let newItem = {
        key: uuidV4(),
        author: this.props.user ? this.props.user.id : null,
        text: this.state.inputValue
      };
      this.props.onSubmit(newItem);
      this.setState({ inputValue: '' });
    }
  }

  onChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    return (
      <div className={"AddListItem" + (this.state.focused ? ' focus' : '') }>
        <ProfileCircle user={this.props.user} />
        <input
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={this.state.inputValue}
          placeholder={'Your thoughts here'}
        />
        <FaPencil size={20} />
      </div>
    )
  }
}