import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
export default class ButtonClass extends Component {

    constructor (props) {
        super(props);
        this.handleClassChoice = this.handleClassChoice.bind(this);
    }

    handleClassChoice () {
      this.props.onButtonClassClick( this.props.classObj );
      return false;
    }

    render () {
        return (
            <ButtonGroup>
                <Button  active={this.props.isActive}
                    key={this.props.classObj.cname}
                    onClick={this.handleClassChoice}>{this.props.classObj.cname} ({this.props.classObj.shortcut})</Button>
            </ButtonGroup>
        )
    }
 }