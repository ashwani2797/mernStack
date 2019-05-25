import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import FormControl from 'material-ui/Form/FormControl';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
import socketIOClient from "socket.io-client";
import Snackbar from 'material-ui/Snackbar';

const styles = theme => ({
    title: {
        fontSize: '20px',
        height: '50px',
        borderBottom: '4px solid lightgrey',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageArea: {
        borderBottom: '4px solid #274496',
        height: '600px',
        overflowY: 'scroll',
        marginTop: '20px',
        paddingLeft: '20px',
        paddingRight: '20px'
    },
    marginLeft: {
        marginLeft: '10px'
    },
    messageBody: {
        display: 'flex',
        alignItems: 'center'
    },
    messageBodySelf: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    message: {
        margin: '10px',
        color: 'white',
        backgroundColor: '#4153b6',
        border: '4px solid #4153b6',
        borderRadius: '5px',
        padding: '2px',
        width: 'fit-content',
    },
    authorBody: {
        margin: '1px',
        marginLeft: '2px',
        padding: '2px',
        width: 'fit-content',
    }
});


class ChatBox extends Component {

    state = {
        user: this.props.user,
        newMessage: '',
        endpoint: "http://192.168.0.104:5000",
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
                console.log("Messages from backend");
                console.log(messageResponse);

                this.setState({ messageList: messageResponse.messageList, conversationId: messageResponse.conversationId });
            }.bind(this));

            socket.on("newMessage", function (newMessage) {
                var messageList = this.state.messageList;
                messageList.push(newMessage);
                this.setState({ messageList });
                console.log("new message recieved");
            }.bind(this));
        });
        this.setState({ socket });
    }

    componentWillReceiveProps(nextProps) {
        const { socket } = this.state;
        if (this.props.activeUser._id != nextProps.activeUser._id) {
            console.log("call socket");
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