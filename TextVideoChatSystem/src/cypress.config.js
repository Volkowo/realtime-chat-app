const { defineConfig } = require("cypress");
const { MongoClient } = require("mongodb");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      console.log("hello")
      on("task", {
        async insertChatMessage({ group, channel, user, message }) {
          const uri = "mongodb://localhost:27017";
          const dbName = "assignmentSF";

          const client = new MongoClient(uri);
          await client.connect();
          const db = client.db(dbName);
          const messageCollection = db.collection("message");

          const messageObj = {
            messageID: `msg${Date.now()}`,
            userID: user,
            groupID: group,
            channelID: channel,
            message,
            images: [],
            datetime: new Date().toString(),
          };

          await messageCollection.insertOne(messageObj);
          await client.close();

          return null; // must return something
        },
      });

      return config; 
    },
    baseUrl: "http://localhost:4200",
  },
});