import config from './../config/config';
import app from './express';
import mongoose from 'mongoose';

const client = require('socket.io').listen(5000).sockets;


// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri)
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`)
})

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
});


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

client.on('connection', function (socket) {
    console.log("Connected on backend");
    var id = socket.id;
    console.log(id);

    socket.on('fetchMessages',function(data){
        console.log(data); 
        client.to(id).emit('messageList', messageList);       
    });

    //create function to send status
    function sendStatus(id,s) {
        //socket.emit('status', s);
        client.to(id).emit('status',s);
    }
});