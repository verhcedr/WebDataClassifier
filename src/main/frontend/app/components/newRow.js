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
        this.state = {
            cname: '',
            directory: '',
            shortcut: ''
        }
        this.handleRemoveClass = this.handleRemoveClass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleRemoveClass () {
      this.props.onClassDelete( this.props.classObj );
      return false;
    }


    handleSubmit () {
        var cname = document.getElementById('cname').value;
        var directory = document.getElementById('directory').value;
        var shortcut = document.getElementById('shortcut').value;
        var newrow = {cname: cname, directory: directory, shortcut: shortcut};
        this.props.onRowSubmit( newrow );

        document.getElementById('cname').value = '';
        document.getElementById('directory').value = '';
        document.getElementById('shortcut').value = '';
        return false;
    }


    render () {
        return (
            <div>
                 <Form inline>
                    <FormGroup controlId="cname" required={true}>
                        <ControlLabel>Name</ControlLabel>
                        {' '}
                        <FormControl componentClass="input"  placeholder="Enter name..." />
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="directory" required={true}>
                        <ControlLabel>Directory</ControlLabel>
                        {' '}
                        <FormControl componentClass="input"  placeholder="Enter dir..." />
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="shortcut" required={true}>
                        <ControlLabel>Shortcut</ControlLabel>
                        {' '}
                        <FormControl componentClass="input"  placeholder="Enter a letter..." />
                    </FormGroup>
                    {' '}
                    <Button onClick={this.handleSubmit}>Add</Button>
                </Form>
            </div>
        )
    }
 }