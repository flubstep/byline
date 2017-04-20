import React, { Component } from 'react';
import FaPencil from 'react-icons/lib/fa/pencil';
import uuidV4 from 'uuid/v4';

import './AddListItem.css';

export default class AddListItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      inputValue: '',
      focused: false
    };
  }

  onFocus = () => { this.setState({ focused: true })}
  onBlur = () => { this.setState({ focused: false })}

  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.onSubmit) {
      let newItem = {
        key: uuidV4(),
        author: 'No one',
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
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={this.state.inputValue}
            placeholder={'Your thoughts here'}
          />
          <FaPencil size={20} />
        </form>
      </div>
    )
  }
}