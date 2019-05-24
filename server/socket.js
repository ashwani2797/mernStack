const socketio = require('socket.io');
import Conversation from './models/conversation.model.js';
import { func } from 'prop-types';

var messageList = [{
    _id: "5b9df161d867342a56ee1fec",
    message: "hello"
}, {
    _id: "5b996be78cf3b00b02c7c25f",
    message: "Hi"
}, {
    _id: "5b9df161d867342a56ee1fec",
    message: "How are you!"
}, {
    _id: "5b996be78cf3b00b02c7c25f",
    message: "Good"
},
{
    _id: "5b9df161d867342a56ee1fec",
    message: "very looooooooonnnnngggggggg messsssssaaaaaageeeeeeeeeee"
}, {
    _id: "5b996be78cf3b00b02c7c25f",
    message: "back end data only"
}];


function createNewConversation(data) {
    let newConversation = new Conversation({ users: [data.sender, data.reciever], lastMessage: '' });
    newConversation.save((err, result) => {
        if (err) {
            console.log("Error while storing conversation" + err);
        }
        console.log(result);
        return result;
    });
}

module.exports.listen = function (port) {
    var onlineUsers = new Map();
    const client = socketio.listen(port).sockets;
    client.on('connection', function (socket) {
        console.log("Connected on backend");
        var id = socket.id;
        console.log(id);

        socket.on('register', function(data){
           onlineUsers.set(data._id,id);
            console.log("Registration success for id" + data._id);
        });

       //On selecting user, this method fetches old chat.
        socket.on('fetchMessages', function (data) {
            console.log(data);
            Conversation.find({ users: { $all: [data.sender, data.reciever] } })
                .exec((err, conversation) => {
                    if (err) {
                        console.log("Error while quering Conversations" + err);
                    }
                    if (!conversation.length) {
                        conversation = createNewConversation(data);
                    }
                    console.log(conversation);
                });
            client.to(id).emit('messageList', messageList);
        });




    });
};
