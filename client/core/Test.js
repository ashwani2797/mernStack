import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import { withStyles } from 'material-ui/styles';
import { Directions } from 'material-ui-icons';

const styles = theme => ({
    messageBody: {
        margin: '10px',
        border: '2px solid grey',
        padding: '10px',
        borderRadius: '10px',
        width:'20%'
    },
    authorBody:{
        margin: '1px',
        marginLeft: '10px',
        padding: '5px',
        borderRadius: '10px',
        width:'fit-content',
        backgroundColor: 'lightgrey'
    },
    title: {
        padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
        color: theme.palette.text.secondary
    },
    media: {
        minHeight: 330
    }
})


class Test extends Component {

    constructor() {
        super();
        this.state = {
            response: false,
            newMessage: '',
            messages: [],
            endpoint: "http://127.0.0.1:5000",
            socket: null
        }
    }


    componentWillMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on('connect', () => {
            console.log("Front end connected");

            socket.on('messages', function (data) {
                console.log("Messages" + data[0].author);
                this.setState({ messages: data });
            }.bind(this));

        })
        this.setState({ socket });
    }

    sendInput = () => {
        const { socket,newMessage} = this.state;
        console.log("sending message" + newMessage);
        let obj = {
            message: newMessage,
            to: '',
            sender: ''
        };
        socket.emit('input', obj);
    };

    handleChange = (event) => {
        this.setState({newMessage: event.target.value});
      }
    renderMessage = (author,message,index,classes) =>(

        <div id={index}> 
            <div className={classes.authorBody}> {author}</div>
            <div className={classes.messageBody}>{message} </div>
        </div>
    );  

    render() {
        const { socket, messages } = this.state;

        const { classes } = this.props;
        console.log("In render");
        return (
            <div className={classes.app_messanger}>
                <div className="header">Header</div>
                <div className="main">
                <div>
                 {messages.map((message,index) => this.renderMessage(message.author,message.message,index,classes))}
                </div>
                <textarea id="messageInput" name="newMessage" value={this.state.newMessage} placeholder="write here...." onChange={event => this.handleChange(event)}></textarea>
                    <button onClick={() => this.sendInput()} >Send message</button>
                </div>
            </div>
        );
    }

}
export default withStyles(styles)(Test);