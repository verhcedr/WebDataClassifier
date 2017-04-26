import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Panel,
  ProgressBar
} from 'react-bootstrap';
import ButtonClass from './buttonClass';
const client = require('../api/client');

export default class ImageClassifier extends Component {

    constructor (props) {
        super(props);
        this.handleClassChoice = this.handleClassChoice.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.recalculateProgress = this.recalculateProgress.bind(this);
    }

    state = {
        currentProgress : 0
    }

    recalculateProgress () {
        client({method: 'GET', path: '/api/classifier/calculateProgress', params: {}}).done(response => {
            this.setState({
                currentProgress: response.entity,
            });
        });
    }

    handleClassChoice (classObj) {
        // Set class into productImage
        this.props.imageProduct["classObj"] = classObj;

        // Post and save the match
        client({
            method: 'POST',
            path: '/api/classifier/link',
            entity: this.props.imageProduct,
            headers: { 'Content-Type': 'application/json' }
        }).done(response => {
            // Ask for an other image
            this.recalculateProgress();
            this.props.handleNextImage();
        });
    }

    handleBack () {
        this.props.handleBackToClassManagement();
    }

    render () {
        var classificationButtonBar = []
        var that = this;
        console.log(this.props.clist)
        this.props.clist.forEach(function(classObj) {
            classificationButtonBar.push(<ButtonClass classObj={classObj} onButtonClassClick={that.handleClassChoice} />);
        });
        return (
            <Panel header="Image Classification">
                <div>
                    <img className="image-container" src={this.props.imageProduct.imageUrl} />
                    <ProgressBar now={this.state.currentProgress} />
                </div>
                <ButtonToolbar>
                    {classificationButtonBar}
                    <Button onClick={this.handleBack} bsStyle="primary">Back</Button>
                </ButtonToolbar>
            </Panel>
        )
    }
 }