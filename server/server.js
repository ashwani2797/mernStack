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


var messages = [
    {
        "author": "ashwani",
        "message": "there"
    },
    {
        "author": "maun",
        "message": "yes"
    },
    {
        "author": "ashwani",
        "message": "I <3 uh"
    }
];


client.on('connection', function (socket) {
    console.log("Connected on backend");
    var id = socket.id;
    console.log(id);

    var obj = {
        success: true,
        message: "done"
    }
//    socket.emit('output',obj);

    client.to(id).emit('messages',messages);

    socket.on('input',function(data){
        console.log(data.message);
        
    });


    //create function to send status
    function sendStatus(id,s) {
        //socket.emit('status', s);
        client.to(id).emit('status',s);
    }
});