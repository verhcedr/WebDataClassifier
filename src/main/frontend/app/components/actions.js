import React, { Component } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Alert,
  Button,
  ButtonToolbar,
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
        this.goBackToClassManagement = this.goBackToClassManagement.bind(this);
        this.exportCsv = this.exportCsv.bind(this);
    }

    state = {
        classList : [],
        currentImage : {},
        displayResult: false,
        displayMsg: null
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
            this.setState({
                currentImage: response.entity,
                displayResult: response.entity.imageUrl == undefined
            });

            // Mask class and image management panels
            document.getElementById("imagesManager").style = "display: none"
            document.getElementById("classManager").style = "display: none"
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

    goBackToClassManagement () {
        document.getElementById("imagesManager").style = "display: block"
        document.getElementById("classManager").style = "display: block"
        document.getElementById("imageClassifier").style = "display: none"
        document.getElementById("resultPanel").style = "display: none"

        this.setState({
            displayResult: false,
            displayMsg: null
        });
        this.getClasses();
    }

    exportCsv () {
        client({method: 'GET', path: '/api/classifier/export', params: {}}).done(response => {
            this.setState({
                displayMsg: "Exported successfully !!"
            });
        });
    }

    render () {
        return (
            <div>
                <div id="classManager" className="col-md-9">
                    <Panel header="Class management">
                        <div className="col-md-9">
                            <NewRow onRowSubmit={this.handleNewRowSubmit}/>
                        </div>
                        <div className="col-md-9">
                            <ClassList clist={this.state.classList} onClassRemove={this.handleClassRemove}/>
                            <Button onClick={this.getClasses}>Reload</Button>
                        </div>
                    </Panel>
                 </div>
                 <div id="imagesManager" className="col-md-9">
                    <Panel  header="Images management">
                        <Form onSubmit={this.launchClassification}>
                            <FormGroup controlId="file">
                                <ControlLabel>CSV File</ControlLabel>
                                <FormControl type="file" />
                            </FormGroup>
                            <FormGroup controlId="images">
                                <ControlLabel>Images</ControlLabel>
                                <FormControl componentClass="textarea" placeholder="Enter image urls here..." />
                            </FormGroup>
                            <Button bsStyle="danger" type="submit">Start</Button>
                        </Form>
                    </Panel>
                 </div>
                 {this.state.currentImage.imageUrl &&
                     <div id="imageClassifier" className="col-md-9">
                        <ImageClassifier
                            clist={this.state.classList}
                            imageProduct={this.state.currentImage}
                            handleNextImage={this.displayNextImage}
                            handleBackToClassManagement={this.goBackToClassManagement}/>
                    </div>
                 }
                {this.state.displayResult &&
                   <div id="resultPanel" className="col-md-9">
                      <Panel header="Finished !">
                          {this.state.displayMsg &&
                             <Alert bsStyle="success">{this.state.displayMsg}</Alert>
                          }
                          <ButtonToolbar>
                              <Button onClick={this.exportCsv} bsStyle="success">Export to CSV</Button>
                              <Button onClick={this.goBackToClassManagement} bsStyle="primary">Back</Button>
                          </ButtonToolbar>
                      </Panel>
                    </div>
                 }
             </div>
        )
    }
 }