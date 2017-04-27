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
        this.handleCnameChange = this.handleCnameChange.bind(this);
        this.handleDirectoryChange = this.handleDirectoryChange.bind(this);
        this.handleShortcutChange = this.handleShortcutChange.bind(this);
        this.handleRemoveClass = this.handleRemoveClass.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCnameChange(event) {
        this.setState({cname: event.target.value});
    }
    handleDirectoryChange(event) {
        this.setState({directory: event.target.value});
    }
    handleShortcutChange(event) {
        this.setState({shortcut: event.target.value});
    }

    handleRemoveClass () {
      this.props.onClassDelete( this.props.classObj );
      return false;
    }


    handleSubmit () {
        this.props.onRowSubmit( this.state );

        this.setState({
            cname: '',
            directory: '',
            shortcut: ''
        });
        return false;
    }

    render () {
        return (
            <div>
                 <Form inline>
                    <FormGroup controlId="cname" required={true}>
                        <ControlLabel>Name</ControlLabel>
                        {' '}
                        <FormControl
                            componentClass="input"
                            placeholder="Enter name..."
                            value={this.state.cname}
                            onChange={this.handleCnameChange}/>
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="directory" required={true}>
                        <ControlLabel>Directory</ControlLabel>
                        {' '}
                        <FormControl
                            componentClass="input"
                            placeholder="Enter dir..."
                            value={this.state.directory}
                            onChange={this.handleDirectoryChange}/>
                    </FormGroup>
                    {' '}
                    <FormGroup controlId="shortcut" required={true}>
                        <ControlLabel>Shortcut</ControlLabel>
                        {' '}
                        <FormControl
                            componentClass="input"
                            placeholder="Enter a letter..."
                            value={this.state.shortcut}
                            onChange={this.handleShortcutChange}/>
                    </FormGroup>
                    {' '}
                    <Button onClick={this.handleSubmit}>Add</Button>
                </Form>
            </div>
        )
    }
 }