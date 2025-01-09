const { Op } = require("sequelize");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");

module.exports.addChat = async (req, res) => {
  const { chat,receiverId,senderId } = req.body;

  if(!chat|| !receiverId||!senderId){
    return res.status(400).json({message:"All fields are required"})
  }

  try {
    const chatCreated = await Chat.create({
      message: chat,
      receiverId:receiverId,
      senderId:senderId,
    });

    if (!chatCreated) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    return res.status(200).json({ message: "chat added" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllChat = async (req, res) => {
 
  const {user1,user2} = req.params;
  console.log( "good", user1,user2)
  try {
    const allMsg = await Chat.findAll({
      where:{
        [Op.or]:[
          {senderId:user1,receiverId:user2},
          {receiverId:user1,senderId:user2}
        ]
      },
      order:[["createdAt","ASC"]]
    })

    return res.status(200).json({ message: "Chat fetched successfully!", data: allMsg });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Failed to fetch chat.", error });
  }


};
