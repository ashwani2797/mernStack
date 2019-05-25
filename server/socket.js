const socketio = require('socket.io');
import Conversation from './models/conversation.model.js';
import Message from './models/message.model.js';

// var messageList = [{
//     _id: "5b9df161d867342a56ee1fec",
//     message: "hello"
// }, {
//     _id: "5b996be78cf3b00b02c7c25f",
//     message: "Hi"
// }, {
//     _id: "5b9df161d867342a56ee1fec",
//     message: "How are you!"
// }, {
//     _id: "5b996be78cf3b00b02c7c25f",
//     message: "Good"
// },
// {
//     _id: "5b9df161d867342a56ee1fec",
//     message: "very looooooooonnnnngggggggg messsssssaaaaaageeeeeeeeeee"
// }, {
//     _id: "5b996be78cf3b00b02c7c25f",
//     message: "back end data only"
// }];


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

        socket.on('register', function (data) {
            onlineUsers.set(data._id, id);
            console.log("Registration success for id" + data._id);
        });

        //On selecting user, this method fetches old chat.
        socket.on('fetchMessages', function (data) {
            Conversation.find({ users: { $all: [data.sender, data.reciever] } })
            .populate('users','_id name')
                .exec((err, conversation) => {
                    if (err) {
                        console.log("Error while quering Conversations" + err);
                    }
                    if (!conversation.length) {
                        console.log("Creating new conversation");
                        conversation = createNewConversation(data);
                    }
                    console.log("Conversation from DB");
                    console.log(JSON.stringify(conversation[0]));
                    conversation = conversation[0];
                    console.log("In fetch messages " + conversation.users);
                    Message.find({ conversationId : conversation._id })
                    
                    .exec((err,messages) => {
                        if (err) {
                            console.log("Error while quering messages" + err);
                        }
                        if (!messages.length) {
                            console.log("No new message found");
                        }
                        console.log("Messages found:");
                        console.log(JSON.stringify(messages));
                       let response =  {
                        conversationId: conversation._id,
                        users: conversation.users,
                        messageList: messages.length ? messages : []
                       }
                       client.to(id).emit('messageList', response);
                    });
                });
        });

        socket.on("sendMessage", function (newMessage) {
            console.log("send new message");
            console.log(newMessage);

            var messageModel = new Message({
                message: newMessage.message,
                author: newMessage.author,
                conversationId: newMessage.conversationId
            });

            messageModel.save((err,result) => {
                if(err){
                    console.log("Error while storing new message: "+ err);
                    return;
                }
                console.log("success storing new message :"+ result);
            })

            let recieverId = onlineUsers.get(newMessage.reciever);
            if(recieverId == null){
                console.log("User not active");
            }
            client.to(recieverId).emit('newMessage', newMessage);
        });




    });
};
