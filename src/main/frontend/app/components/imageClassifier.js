import React, { Component } from 'react';
import {
  Button,
  Panel
} from 'react-bootstrap';

export default class ImageClassifier extends Component {

    constructor (props) {
        super(props);
        this.handleClassChoice = this.handleClassChoice.bind(this);
    }

    state = {
    }

    handleClassChoice (source) {

    }

    render () {
        var classificationButtonBar = []
        var that = this; // TODO: Needs to find out why that = this made it work; Was getting error that onClassDelete is not undefined
        console.log(this.props.clist)
        this.props.clist.forEach(function(classObj) {
            classificationButtonBar.push(<Button key={classObj.cname} onClick={that.handleClassChoice()}>{classObj.cname}</Button>);
        });
        return (
            <div className="col-md-9">
                <Panel header="Image Classification">
                    <div className="col-md-5">
                        {this.props.imageProduct.imageUrl &&
                            <img src={this.props.imageProduct.imageUrl} />
                        }
                        {classificationButtonBar}
                    </div>
                    <div className="col-md-5">
                        {classificationButtonBar}
                    </div>
                </Panel>
             </div>
        )
    }
 }