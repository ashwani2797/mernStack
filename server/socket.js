const socketio = require('socket.io');
import Conversation from './models/conversation.model.js';
import Message from './models/message.model.js';





module.exports.listen = function (port) {
    var onlineUsers = new Map();
    const client = socketio.listen(port).sockets;
    client.on('connection', function (socket) {
        var id = socket.id;

        socket.on('register', function (data) {
            onlineUsers.set(data._id, id);
            console.log("Registration success for id" + data._id);
        });

        //On selecting user, this method fetches old chat.
        socket.on('fetchMessages', function (data) {
            Conversation.find({ users: { $all: [data.sender, data.reciever] } })
                .populate('users', '_id name')
                .exec((err, conversation) => {
                    if (err) {
                        console.log("Error while quering Conversations" + err);
                    }
                    if (!conversation.length) {
                        console.log("No Conversation found");
                        let newConversation = new Conversation({ users: [data.sender, data.reciever], lastMessage: '' });
                        newConversation.save((err, result) => {
                            if (err) {
                                console.log("Error while storing conversation" + err);
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
                        console.log("Error while quering messages" + err);
                    }
                    if (!messages.length) {
                        console.log("No new message found");
                    }
                    let response = {
                        conversationId: conversation._id,
                        users: conversation.users,
                        messageList: messages.length ? messages : []
                    }
                    client.to(id).emit('messageList', response);
                });
        }


        socket.on("sendMessage", function (newMessage) {
            var messageModel = new Message({
                message: newMessage.message,
                author: newMessage.author,
                conversationId: newMessage.conversationId
            });

            messageModel.save((err, result) => {
                if (err) {
                    console.log("Error while storing new message: " + err);
                    return;
                }
                console.log("success storing new message :" + result);
            })

            let recieverId = onlineUsers.get(newMessage.reciever);
            if (recieverId == null) {
                console.log("User not active");
                return;
            }
            client.to(recieverId).emit('newMessage', newMessage);
        });

    });
};
