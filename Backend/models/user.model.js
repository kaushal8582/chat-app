const Sequelize = require("sequelize");
const Database = require("../utils/database");

// Define the User model
const User = Database.define("User", {
  id: {
    type: Sequelize.UUID, // Use INTEGER for auto-incrementing IDs
    defaultValue: Sequelize.UUIDV4, // Enable auto-increment
    primaryKey: true, // Set as primary key
    allowNull: false, // Disallow null values
  },
  name: {
    type: Sequelize.STRING, // Define a name column
    allowNull: false, // Disallow null values
  },
  email: {
    type: Sequelize.STRING, // Define an email column
    allowNull: false, // Disallow null values
    unique: true, // Ensure emails are unique
    validate: {
      isEmail: true, // Validate email format
    },
  },
  phone: {
    type: Sequelize.STRING, // Define a phone number column
    allowNull: false, // Disallow null values
    validate: {
      isNumeric: true, // Validate that phone is numeric
    },
  },
  password: {
    type: Sequelize.STRING, // Define a password column
    allowNull: false, // Disallow null values
  },
});

module.exports = User;
