const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("joingroup", ( groupname ) => {
      socket.join(groupname);
      console.log("user join group : ", groupname);
    });

    socket.on("joinusergroup", ( groupname) => {
      socket.join(groupname);
      console.log("user join group: ", groupname);
    });

    socket.on("sendGroupMsg", async ({ msg, sender, groupid, text }) => {
      try {
        console.log({ msg, sender, groupid });
        const messageSend = await Message.create({
          groupId: groupid,
          senderId: sender,
          content: msg,
        });

        // Emit the message to everyone in the group
        io.to(text).emit("receiveMessage", messageSend);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("sendMsg", async ({ msg, receiver, sender }) => {
      console.log({ msg, sender, receiver });

      try {
        const chatCreated = await Chat.create({
          message: msg,
          receiverId: receiver,
          senderId: sender,
        });

        let value = sender + receiver;
        const sortedValue = value.split("").sort().join("");
        console.log(sortedValue)

        io.to(sortedValue).emit("receivePersonalMessage", chatCreated);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

module.exports = socketHandler;
