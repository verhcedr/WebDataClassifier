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

export default class Actions extends Component {

    constructor (props) {
        super(props);
        this.launchClassification = this.launchClassification.bind(this);
        this.handleNewRowSubmit = this.handleNewRowSubmit.bind(this);
        this.handleClassRemove = this.handleClassRemove.bind(this);
    }

    state = {
        classList : [{cname:'ClassA', directory:'/classA'}],
        urls : ''
    }

    launchClassification (value) {
    // TODO
//        this.setState({
//            search: this.state.inputSearch
//        });
    }

    handleNewRowSubmit(newLine) {
        console.log(newLine)
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
                            <ClassList clist={this.state.classList}  onClassRemove={this.handleClassRemove}/>
                        </div>
                    </Panel>
                 </div>
                 <Home />
             </div>
        )
    }
 }