import React, { Component } from 'react';



class FacebookLogin extends Component {

    constructor({ match }) {
        super();
        this.state = {
            "success": "/"
        }
        this.match = match;
    }

    render() {
        console.log(this.match.params);
        return (
            <div><h3>Hello from FacebookLogin</h3> </div>
        );
    }


}

export default FacebookLogin;