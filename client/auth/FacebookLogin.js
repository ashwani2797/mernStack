import React, { Component } from 'react';
import auth from './../auth/auth-helper';
import { Redirect } from 'react-router-dom'



class FacebookLogin extends Component {

    constructor({ match }) {
        super();
        this.state = {
            "redirectToHome": false,
            "isLoading": true
        }
        this.match = match;
    }

    componentDidMount() {
        let decodedURL = decodeURIComponent(this.match.params.content);
        try {
            let jwt = JSON.parse(decodedURL);
            auth.authenticate(jwt, () => {
                this.setState({ redirectToHome: true, isLoading: false});
            });
        } catch (e) {
            this.setState({ redirectToHome: false, isLoading: false });
        }
    }

    render() {
        if (this.state.redirectToHome) {
            return (<Redirect to="/" />);
        } else {
            return (<div>
                {this.state.isLoading && <h3>Loading....</h3>}
                {this.state.isLoading || <h3>Error while logging by facebook</h3>}
            </div>);
        }
    }
}

export default FacebookLogin;