const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const {createServer} = require("http")
const{Server} = require("socket.io")
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
const Message = require("./models/message.model");
const socketHandler = require("./socket/socketHandler");

const app = express();

const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:'*',
    credentials:true,
    methods:["GET","POST"]
  }
})



socketHandler(io);

app.use(cors({
  origin:'*',
  credentials:true,
  methods:["GET","POST"]
}));


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
    server.listen(process.env.PORT || 3000, () => {
      console.log("Server is started");
    });
  })
  .catch((error) => {
    console.log(error);
  });


