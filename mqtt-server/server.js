const express = require('express');
const socket = require('socket.io');
const mqtt = require('mqtt')
const port = 3000;
// App setup
const app = express();

const server = app.listen(port, function () {
    console.log(`
    -------------Resume-------------------
    status:     listening
    port:       ${port}
    url:        http://localhost:${port}
    --------------------------------------`);
});

// Socket setup
const io = socket(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Listen for new connection and print a message in console
io.on('connection', (socket) => {

    console.log(`
    ------------New connection---------------------
    
    Connection ID:   ${socket.id}
    IP:              ${socket.handshake.address}
    Time:            ${socket.handshake.time}
    ----------------------------------------------`)

});

const url = "wss://mqtttest.connio.cloud:8083/mqtt";


const options = {
    clientId: "digiterra-coding-task-1",
    username: "",
    password: "",
};

// Create a client connection
const client = mqtt.connect(url, options);


client.on('connect', function () { // When connected
    // subscribe to a topic
    client.subscribe('$SYS', function () {
        // when a message arrives, do something with it
        client.on('message', function (topic, data, packet) {
            io.sockets.emit('dataUpdate', data.toString())
        });
    });
});

client.on('error', function (err) {
    console.log(err);
});
