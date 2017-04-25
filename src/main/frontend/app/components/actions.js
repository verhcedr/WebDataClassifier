import React, { Component } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Panel
} from 'react-bootstrap';
import Home from './home';
import ClassList from './classList';
import ClassObj from './class';
import NewRow from './newRow';
const client = require('../api/client');

export default class Actions extends Component {

    constructor (props) {
        super(props);
        this.launchClassification = this.launchClassification.bind(this);
        this.handleNewRowSubmit = this.handleNewRowSubmit.bind(this);
        this.handleClassRemove = this.handleClassRemove.bind(this);
        this.getClasses = this.getClasses.bind(this);
    }

    state = {
        classList : [],
        urls : ''
    }

    getClasses () {
        client({method: 'GET', path: '/api/classifier/all', params: {}}).done(response => {
            this.setState({
                classList: response.entity
            });
        });
    }

    launchClassification (event) {
        event.preventDefault();

        var object = {};
        object["images"] = document.getElementById("images").value;
        object["file"] = document.getElementById("file").files[0];
        object["classes"] = JSON.stringify(this.state.classList);

        console.log(object);

        client({
            method: 'POST',
            path: '/api/classifier/upload',
            entity: object,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(
            function(response) {
                console.log("Rest response: ", response);
            }, function(error) {
                console.log("Error: ", error);
            }
        );
    }

    handleNewRowSubmit(newLine) {
        this.setState( {classList: this.state.classList.concat([newLine])} );
    }
    
    
    handleClassRemove ( classObj ) {
      var index = -1;
      var clength = this.state.classList.length;
        for( var i = 0; i < clength; i++ ) {
            if( this.state.classList[i].cname === classObj.cname ) {
                index = i;
                break;
            }
        }
        this.state.classList.splice( index, 1 );
        this.setState( {classList: this.state.classList} );
    }

    render () {
        return (
            <div>
                 <div className="col-md-5">
                    <Panel header="Images management">
                    <Form onSubmit={this.launchClassification}>
                        <FormGroup controlId="file">
                            <ControlLabel>CSV File</ControlLabel>
                            <FormControl type="file" />
                        </FormGroup>
                        <FormGroup controlId="images">
                            <ControlLabel>Images</ControlLabel>
                            <FormControl componentClass="textarea" placeholder="Enter image urls here..." />
                        </FormGroup>
                        <Button type="submit">Start</Button>
                    </Form>
                    </Panel>
                 </div>
                 <div className="col-md-5">
                    <Panel header="Class management">
                        <div className="col-md-5">
                            <NewRow onRowSubmit={this.handleNewRowSubmit}/>
                        </div>
                        <div className="col-md-5">
                            <ClassList clist={this.state.classList} onClassRemove={this.handleClassRemove}/>
                            <Button onClick={this.getClasses}>Reload</Button>
                        </div>
                    </Panel>
                 </div>
                 <Home />
             </div>
        )
    }
 }