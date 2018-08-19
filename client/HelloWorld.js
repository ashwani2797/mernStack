import React,{ Component } from 'react'
import { hot } from 'react-hot-loader'

class HelloWorld extends Component{
    render() {
        return (
            <div>
            <h1>KIKI ! Do you love me ?</h1>
        </div>
    )
    }

}

export default hot(module)(HelloWorld)
