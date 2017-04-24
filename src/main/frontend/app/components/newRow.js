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
            directory: ''
        }
        this.handleRemoveClass = this.handleRemoveClass.bind(this);
//        this.handleChangeName = this.handleChangeName.bind(this);
//        this.handleChangeDirectory = this.handleChangeDirectory.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleRemoveClass () {
      this.props.onClassDelete( this.props.classObj );
      return false;
    }

//
//    handleChangeName(event) {
//        this.setState({cname: event.target.value});
//    }
//
//    handleChangeDirectory(event) {
//        this.setState({directory: event.target.value});
//    }


    handleSubmit () {
        var cname = document.getElementById('cname').value;
        var directory =document.getElementById('directory').value;
        var newrow = {cname: cname, directory: directory};
        this.props.onRowSubmit( newrow );

        document.getElementById('cname').value = '';
        document.getElementById('directory').value = '';
        return false;
    }


    render () {
        return (
            <div>
                 <Form>
                    <FormGroup controlId="cname">
                        <ControlLabel>Name</ControlLabel>
                        <FormControl componentClass="input"  placeholder="Enter name..." />
                    </FormGroup>
                    <FormGroup controlId="directory">
                        <ControlLabel>Directory</ControlLabel>
                        <FormControl componentClass="input"  placeholder="Enter dir..." />
                    </FormGroup>
                    <Button onClick={this.handleSubmit}>Add</Button>
                </Form>
            </div>
        )
    }
 }