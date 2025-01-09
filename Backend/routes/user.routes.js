const {Router} = require("express");
const { registerUser, loginUser, getAllUsers } = require("../controllers/user.controller");
const {authentaction}  = require("../middleware/Auth.middleware")

const router = Router()

router.post("/register",registerUser);
router.post("/login",loginUser)
router.get("/get-all-user",authentaction,getAllUsers)



module.exports = router;