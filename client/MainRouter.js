import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import FacebookLogin from './auth/FacebookLogin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import ChatApp from './chat/chatGrid';

class MainRouter extends Component {

    // Removes the server-side injected CSS when React component mounts
    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side')
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }

    render() {
        return (
            <div>
                <Menu/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/users" component={Users}/>
                    <Route path="/signup" component={Signup}/>
                    <Route path="/signin" component={Signin}/>
                    <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
                    <Route path="/login/facebook/:content" component={FacebookLogin}/>
                    <Route path="/user/:userId" component={Profile}/>
                    <PrivateRoute path="/api/chat" component={ChatApp}/>
                </Switch>
            </div>
        )
    }
}

export default MainRouter