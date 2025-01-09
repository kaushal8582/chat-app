const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const userRoute = require("./routes/user.routes");
const chatRoute = require("./routes/chat.routes")
const groupRoute = require("./routes/group.routes")

const database = require("./utils/database");
const User = require("./models/user.model");
const Chat = require("./models/chat.model")
const Group = require("./models/group.models")
const UserGroup = require("./models/UsersGroups.model")
const Message = require("./models/message.model")

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/chat",chatRoute)
app.use("/group",groupRoute)


User.hasMany(Chat,{foreignKey:'senderId'})
User.hasMany(Chat,{foreignKey:"receiverId"})


Chat.belongsTo(User,{foreignKey:"senderId"});
Chat.belongsTo(User,{foreignKey:"receiverId"});


User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup});

// UserGroup.belongsTo(Group,{foreignKey:"UserId"})

Group.hasMany(Message,{foreignKey:'groupId'})
Message.belongsTo(Group,{foreignKey:'groupId'});

User.hasMany(Message,{foreignKey:"senderId"})
Message.belongsTo(User,{foreignKey:"senderId"})


database
  .sync()
  .then((re) => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is started");
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is started");
});
