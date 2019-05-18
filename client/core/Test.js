import React, { Component } from 'react';
import s from './style.scss';
import withStyles from 'isomorphic-style-loader/withStyles';

class Test extends Component {

    render() {
        return (<div className={s.rang}> Hello from test component</div>);
    }
}
export default withStyles(s)(Test);