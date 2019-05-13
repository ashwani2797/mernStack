import React, { Component } from 'react';
import auth from './../auth/auth-helper';
import { Redirect } from 'react-router-dom'



class FacebookLogin extends Component {

    constructor({ match }) {
        super();
        this.state = {
            "redirectToHome": false
        }
        this.match = match;
    }

    componentDidMount() {
        let decodedURL = decodeURIComponent(this.match.params.content);
        try{
            let jwt = JSON.parse(decodedURL);
            auth.authenticate(jwt, () => {
                this.setState({ redirectToHome: true });
        });
        } catch(e){
            this.setState({ redirectToHome: false });
        }     
    }

    render() {
        if (this.state.redirectToHome) {
           return (<Redirect to="/" />);
        } else {
            return (<div><h3>Error while logging by facebook</h3> </div>);
        }
    }
}

export default FacebookLogin;