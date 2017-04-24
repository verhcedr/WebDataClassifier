import React, { Component } from 'react';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Panel
} from 'react-bootstrap';

export default class NewRow extends Component {

    constructor (props) {
        super(props);
        this.handleRemoveClass = this.handleRemoveClass.bind(this);
    }

    handleRemoveClass () {
      this.props.onClassDelete( this.props.classObj );
      return false;
    }


    handleSubmit (e) {
        e.preventDefault()
        var cname = this.refs.cname.getDOMNode().value;
        var directory = this.refs.directory.getDOMNode().value;
        var newrow = {cname: cname, directory: directory};
        this.props.onRowSubmit( newrow );

        document.getElementById('cname').value = '';
        document.getElementById('directory').value = '';
        return false;
    }


    render () {
        return (
            <div>
                 <Form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="cname">
                        <ControlLabel>Name</ControlLabel>
                        <FormControl componentClass="input"  placeholder="Enter name..." />
                    </FormGroup>
                    <FormGroup controlId="directory">
                        <ControlLabel>Directory</ControlLabel>
                        <FormControl componentClass="input"  placeholder="Enter dir..." />
                    </FormGroup>
                    <Button type="submit">Add</Button>
                </Form>
            </div>
        )
    }
 }