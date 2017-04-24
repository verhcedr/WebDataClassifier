import React, { Component } from 'react';
import { render } from 'react-dom';
import Main from './components/main';
import Actions from './components/actions';
import {Router, Route, browserHistory} from 'react-router';
import './styles/wdc.css';

render(
    <Router history={browserHistory}>
        <Route component={Main}>
            <Route path="/" component={Actions}/>
        </Route>
    </Router>,
    document.getElementById('react')
);