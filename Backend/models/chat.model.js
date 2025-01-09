const Sequelize = require("sequelize");
const Database = require("../utils/database");

const Chat = Database.define("Chat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId:{
    type:Sequelize.UUID,
    allowNull:false
  },
  receiverId:{
    type:Sequelize.UUID,
    allowNull:false,
  }
});


module.exports= Chat;
