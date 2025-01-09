
const {Router} = require("express");
const { addChat, getAllChat } = require("../controllers/chat.controller");
const { authentaction } = require("../middleware/Auth.middleware");

const router = Router();


router.post("/add-chat",authentaction,addChat);
router.get("/get-all-chat/:user1/:user2",authentaction,getAllChat)



module.exports = router;