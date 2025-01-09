const Sequelize = require("sequelize");
const Database = require("../utils/database");

const UserGroup = Database.define("UserGroup", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  role: {
    type: Sequelize.DataTypes.ENUM("admin", "member"),
    defaultValue: "member",
  },
});


module.exports = UserGroup;
