const socketio = require('socket.io');
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import events from './events';
import errorHandler from './../helpers/dbErrorHandler';


module.exports.listen = function (port) {
    var onlineUsers = new Map();
    const client = socketio.listen(port).sockets;
    client.on(events.CONNECTION, function (socket) {
        var id = socket.id;

        socket.on(events.REGISTER, function (user) {
            onlineUsers.set(user._id, id);
            console.log("Registration success for id" + user._id);
        });

        //On selecting user, this method fetches persisted chat.
        socket.on(events.FETCH_MESSAGES, function (userDetails) {
            Conversation.find({ users: { $all: [userDetails.sender, userDetails.reciever] } })
                .populate('users', '_id name')
                .exec((err, conversation) => {
                    if (err) {
                        console.log("Error while quering Conversations" + err);
                    }
                    if (!conversation.length) {
                        console.log("No Conversation found");
                        let newConversation = new Conversation({ users: [userDetails.sender, userDetails.reciever], lastMessage: '' });
                        newConversation.save((err, result) => {
                            if (err) {
                                console.log(errorHandler.getErrorMessage(err));
                            }
                            console.log("new conversation saved" + newConversation);
                            fetchMessages(conversation);
                        });
                    } else {
                        fetchMessages(conversation[0]);
                    }
                });
        });


        function fetchMessages(conversation) {
            Message.find({ conversationId: conversation._id })
                .exec((err, messages) => {
                    if (err) {
                        console.log(errorHandler.getErrorMessage(err));
                    }
                    if (!messages.length) {
                        console.log("No new message found");
                    }
                    let response = {
                        conversationId: conversation._id,
                        users: conversation.users,
                        messageList: messages.length ? messages : []
                    }
                    client.to(id).emit(events.MESSAGE_LIST, response);
                });
        }


        socket.on(events.SEND_MESSAGE, function (newMessage) {
            var messageModel = new Message({
                message: newMessage.message,
                author: newMessage.author,
                conversationId: newMessage.conversationId
            });

            messageModel.save((err, result) => {
                if (err) {
                    console.log(errorHandler.getErrorMessage(err));
                    return;
                }
                console.log("success storing new message :" + result);
            })

            let recieverId = onlineUsers.get(newMessage.reciever);
            if (recieverId == null) {
                console.log("User not active");
                return;
            }
            client.to(recieverId).emit(events.NEW_MESSAGE, newMessage);
        });

    });
};
