import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import socketIOClient from "socket.io-client";
import Snackbar from 'material-ui/Snackbar';
import styles from './style.js';

class ChatBox extends Component {

    state = {
        user: this.props.user,
        newMessage: '',
        endpoint: "http://127.0.0.1:5000",
        socket: null,
        messageList: [],
        notificationMessage: 'new message',
        showNotification: false,
        conversationId: ''
    }

    componentWillMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on('connect', () => {
            console.log("Front end connected");
            socket.emit('register', this.props.user);

            socket.on('messageList', function (messageResponse) {
                this.setState({ messageList: messageResponse.messageList, conversationId: messageResponse.conversationId });
            }.bind(this));

            socket.on("newMessage", function (newMessage) {
                if(newMessage.author !== this.props.activeUser._id){
                    let notification ="New message from " + newMessage.authorName;
                    this.setState({ showNotification: true,notificationMessage: notification});
                }
                var messageList = this.state.messageList;
                messageList.push(newMessage);
                this.setState({ messageList });
            }.bind(this));
        });
        this.setState({ socket });
    }

    componentWillReceiveProps(nextProps) {
        const { socket } = this.state;
        if (this.props.activeUser._id != nextProps.activeUser._id) {
            var data = {
                sender: this.props.user._id,
                reciever: nextProps.activeUser._id
            }
            socket.emit('fetchMessages', data);
        }
    }

    handleChange = (event) => {
        console.log(event.target.value);
        this.setState({ newMessage: event.target.value });
    }

    renderMessage = (id, message, index, classes) => {
        if (this.props.activeUser._id == id) {
            return (
                <div className={classes.messageBody} key={index}>
                    <div className={classes.authorBody}> {this.props.activeUser.name}</div>
                    <div className={classes.message}>{message} </div>
                </div>
            );
        }
        return (
            <div className={classes.messageBodySelf} key={index}>
                <div className={classes.message}>{message} </div>
                <div className={classes.authorBody}>{this.props.user.name}</div>
            </div>
        );
    };

    handleClose = () => {
        this.setState({ showNotification: false });
    };

    sendMessage = () => {
        var { socket, newMessage, messageList } = this.state;
        var data = {
            message: newMessage,
            author: this.props.user._id,
            authorName: this.props.user.name,
            reciever: this.props.activeUser._id,
            conversationId: this.state.conversationId
        }
        socket.emit("sendMessage", data);
        messageList.push(data);
        this.setState({ newMessage: '', messageList: messageList });
    }


    render() {
        const { classes } = this.props;
        console.log(this.props.user);
        if (this.props.activeUser.name === "no_user") {
            return (<div>Please select the user to start the chat</div>);
        }
        return (
            <div>
                <div className={classes.title}>
                    <Avatar src={'/api/users/photo/' + this.props.activeUser._id} />
                    <div className={classes.marginLeft}>
                        {this.props.activeUser.name}
                    </div>
                </div>
                <div className={classes.messageArea}>
                    {this.state.messageList.map((message, index) => this.renderMessage(message.author, message.message, index, classes))}
                </div>

                <div>

                    <TextField
                        id="filled-textarea"
                        label="Write new message...."
                        placeholder="Please give your valuable feedback."
                        value={this.state.newMessage}
                        rowsMax="8"
                        rows="5"
                        margin="normal"
                        variant="outlined"
                        onChange={event => this.handleChange(event)}
                        fullWidth
                    />
                    <Button
                        disabled={this.state.newMessage.length == 0}
                        variant="raised"
                        color="primary"
                        size="large"
                        onClick={() => this.sendMessage()}
                        fullWidth>
                        Send
                        </Button>

                </div>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={this.state.showNotification}
                    onClose={this.handleClose}
                    autoHideDuration={3000}
                    message={this.state.notificationMessage}
                />
            </div>);
    }
}

ChatBox.propTypes = {
    activeUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default withStyles(styles)(ChatBox);