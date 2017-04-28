import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  ButtonGroup,
  Panel,
  ProgressBar,
  Well
} from 'react-bootstrap';
import ButtonClass from './buttonClass';
const client = require('../api/client');
import {HotKeys} from 'react-hotkeys';

export default class ImageClassifier extends Component {

    constructor (props) {
        super(props);
        this.handleClassChoice = this.handleClassChoice.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.recalculateProgress = this.recalculateProgress.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.refreshImage = this.refreshImage.bind(this);
        this.handleStopAndExport = this.handleStopAndExport.bind(this);
    }

    state = {
        currentProgress : 0,
        keyMap : { 'refreshImg': ['r']}
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

    handlePrevious () {
        this.props.handlePreviousImage();
        this.recalculateProgress();
    }

    getImageUrl () {
        return this.props.imageProduct.imageUrl + "?t=" + new Date().getTime();
    }

    refreshImage () {
        document.getElementById("image").src = this.getImageUrl();
    }

    handleStopAndExport () {
        this.props.handleExport();
        this.props.handleBackToClassManagement();
    }

    isCurrentClass(classObj) {
        return this.props.imageProduct.classObj && this.props.imageProduct.classObj.cname === classObj.cname;
    }

    render () {
        var classificationButtonBar = [];
        var that = this;
        this.props.clist.forEach(function(classObj) {
            classificationButtonBar.push(<ButtonClass isActive={that.isCurrentClass(classObj)} classObj={classObj} onButtonClassClick={that.handleClassChoice} />);
        });

        const handlers = {
            'refreshImg': this.refreshImage
        };
        return (
            <HotKeys keyMap={this.state.keyMap} handlers={handlers} >
                <Panel header="Image Classification">
                    <div>
                        <Well bsSize="small">Actual class : <b>{this.props.imageProduct.classObj ? this.props.imageProduct.classObj.cname : 'undefined'}</b></Well>
                        <img id="image" className="image-container" src={this.getImageUrl()} />
                        <ProgressBar active now={this.state.currentProgress} />
                    </div>
                    <ButtonToolbar>
                        <ButtonGroup justified>
                            {classificationButtonBar}
                        </ButtonGroup>
                    </ButtonToolbar>
                    <br />
                    <ButtonToolbar>
                        <Button onClick={this.handlePrevious} bsStyle="primary">Previous</Button>
                        <Button onClick={this.refreshImage} bsStyle="info">Refresh (R)</Button>
                        <Button onClick={this.handleStopAndExport} bsStyle="warning">Stop and Export</Button>
                        <Button onClick={this.handleBack} bsStyle="danger">Cancel</Button>
                    </ButtonToolbar>
                </Panel>
            </HotKeys>
        )
    }
 }