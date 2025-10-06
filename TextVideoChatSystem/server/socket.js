function connect(io, port){
    io.on('connection', (socket) => {
        console.log(`User connected on port ${port}: ${socket.id}`);

        socket.on('message', (message) => {
            console.log(`message: ${message}`);
            io.emit("message", message)
        })
    })
}

module.exports = {connect};