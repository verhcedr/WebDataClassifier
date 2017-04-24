import React, { Component } from 'react';

export default class ClassObj extends Component {

    constructor (props) {
        super(props);
        this.handleRemoveClass = this.handleRemoveClass.bind(this);
    }

    handleRemoveClass () {
      this.props.onClassDelete( this.props.classObj );
      return false;
    }

    render () {
        return (
            <tr>
              <td>{this.props.classObj.cname}</td>
              <td>{this.props.classObj.directory}</td>
              <td><input type="button"  className="btn btn-primary" value="Remove" onClick={this.handleRemoveClass}/></td>
            </tr>
        )
    }
 }