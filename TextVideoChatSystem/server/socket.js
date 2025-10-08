function connect(io, port, userCollection){
    io.on('connection', (socket) => {
        console.log(`User connected on port ${port}: ${socket.id}`);

        // send message
        socket.on('message', ({message, channelID}) => {
            console.log(`message AAAAAAAAAAAAA: ${message}`);
            io.to(channelID).emit("message", message)
        })

        // send image
        socket.on('image', (image) => {
            console.log(`image: ${image}`);
            io.emit("image", image)
        })

        // join channel
        socket.on('joinChannel', async ({channelID, userID}) => {
            socket.join(channelID)
            console.log(`User ${userID} joined channel ${channelID}`);

            const user = await userCollection.findOne({ id: userID });
            const username = user ? user.username : userID;

            io.to(channelID).emit("joinChannel", {userID, username})
        })

        // leave channel
        socket.on('leaveChannel', async ({channelID, userID}) => {
            socket.leave(channelID)
            
            const user = await userCollection.findOne({ id: userID });
            const username = user ? user.username : userID;

            io.to(channelID).emit("leaveChannel", {userID, username})
        })
        
        // join group
        socket.on('joinGroup', ({groupID, userID}) => {
            socket.join(groupID)
            io.to(groupID).emit("joinGroup", userID)
        })

        // leave group
        socket.on('leaveGroup', ({groupID, userID}) => {
            socket.leave(groupID)
            io.to(groupID).emit("leaveGroup", userID)
        })
    })
}

module.exports = {connect};