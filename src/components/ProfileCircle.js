import React, { Component } from 'react';
import { ICON_OPTIONS } from '../store/user';
import FaUser from 'react-icons/lib/fa/user';

import './ProfileCircle.css';

export default class ProfileCircle extends Component {

  render() {
    const IconCls = ICON_OPTIONS[this.props.user.icon] || FaUser;
    const iconSize = this.props.iconSize || Math.floor(this.props.size / 2);
    const color = this.props.user.color || '#eeeeee';
    return (
      <div className="ProfileCircle" style={{
        height: this.props.size,
        width: this.props.size,
        backgroundColor: color,
        borderRadius: this.props.size / 2
      }}>
        <IconCls fill="white" size={iconSize} />
      </div>
    )
  }
}

ProfileCircle.defaultProps = {
  size: 24,
  user: {}
};
