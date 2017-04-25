import React, { Component } from 'react';
import ClassObj from './class';

export default class ClassList extends Component {

    constructor (props) {
        super(props);
        this.handleClassRemove = this.handleClassRemove.bind(this);
    }
    
    handleClassRemove (classObj){
        this.props.onClassRemove( classObj );
    }

    render () {
        var classList = [];
        var that = this; // TODO: Needs to find out why that = this made it work; Was getting error that onClassDelete is not undefined
        this.props.clist.forEach(function(classObj) {
            if(classObj.cname) {
                classList.push(<ClassObj key={classObj.cname} classObj={classObj} onClassDelete={that.handleClassRemove} /> );
            }
        });
        return (
            <div>
              <table className="table table-striped">
                <thead><tr><th>Class Name</th><th>Directory</th><th>Action</th></tr></thead>
                <tbody>{classList}</tbody>
              </table>
            </div>
        )
    }
 }