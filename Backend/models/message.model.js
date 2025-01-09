const Sequelize = require("sequelize");
const Database = require("../utils/database");

const GroupMessage = Database.define("GroupMessage", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  groupId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});


module.exports = GroupMessage;