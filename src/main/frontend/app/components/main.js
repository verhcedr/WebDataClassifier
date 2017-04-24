import React, { Component } from 'react';

export default class Main extends Component {

    constructor (props) {
        super(props);
    }

	render() {
		return (
            <div>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
		)
	}
}