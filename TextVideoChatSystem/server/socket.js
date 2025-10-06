function connect(io, port){
    io.on('connection', (socket) => {
        console.log(`User connected on port ${port}: ${socket.id}`);

        // send message
        socket.on('message', (message) => {
            console.log(`message: ${message}`);
            io.emit("message", message)
        })

        // send image
        socket.on('image', (image) => {
            console.log(`image: ${image}`);
            io.emit("image", image)
        })

        // join channel
        socket.on('joinChannel', ({channelID, userID}) => {
            socket.join(channelID)
            io.to(channelID).emit("userJoin", userID)
        })

        // leave channel
        socket.on('leaveChannel', ({channelID, userID}) => {
            socket.leave(channelID)
            io.to(channelID).emit("userJoin", userID)
        })
        
        // join group
        socket.on('joinGroup', ({groupID, userID}) => {
            socket.join(groupID)
            io.to(groupID).emit("userJoin", userID)
        })

        // leave group
        socket.on('leaveGroup', ({groupID, userID}) => {
            socket.leave(groupID)
            io.to(groupID).emit("userJoin", userID)
        })
    })
}

module.exports = {connect};