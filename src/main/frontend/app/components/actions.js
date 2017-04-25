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
import ImageClassifier from './imageClassifier';
const client = require('../api/client');

export default class Actions extends Component {

    constructor (props) {
        super(props);
        this.launchClassification = this.launchClassification.bind(this);
        this.handleNewRowSubmit = this.handleNewRowSubmit.bind(this);
        this.handleClassRemove = this.handleClassRemove.bind(this);
        this.getClasses = this.getClasses.bind(this);
        this.displayNextImage = this.displayNextImage.bind(this);
    }

    state = {
        init : true,
        classList : [],
        urls : '',
        currentImage : {}
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

        client({
            method: 'POST',
            path: '/api/classifier/upload',
            entity: object,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).done(response => {
            this.displayNextImage();
        });
    }

    displayNextImage () {
        client({method: 'GET', path: '/api/classifier/nextImage', params: {}}).done(response => {
            console.log(response.entity)
            this.setState({
                init: false,
                currentImage: response.entity
            });
        });
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
                 <div className="col-md-9">
                    <Panel header="Images management" collapsible expanded={this.state.init}>
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
                 <div className="col-md-9">
                    <Panel header="Class management" collapsible expanded={this.state.init}>
                        <div className="col-md-5">
                            <NewRow onRowSubmit={this.handleNewRowSubmit}/>
                        </div>
                        <div className="col-md-5">
                            <ClassList clist={this.state.classList} onClassRemove={this.handleClassRemove}/>
                            <Button onClick={this.getClasses}>Reload</Button>
                        </div>
                    </Panel>
                 </div>
                 <ImageClassifier
                        clist={this.state.classList}
                        imageProduct={this.state.currentImage} />
             </div>
        )
    }
 }