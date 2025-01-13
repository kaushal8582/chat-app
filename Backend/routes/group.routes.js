const {Router} = require("express");
const { createGroup, addMemberInGroup, getGroups, getGroupMessage, grouMembers, checkAdmin, notInGroupMember, removeMember, makeAdmin, uploadFile } = require("../controllers/group.controller");
const  upload  = require("../middleware/multer.middleware");
const router = Router();


router.post("/create",createGroup);
router.post("/add-member-group/:groupId",addMemberInGroup);
router.post("/get-all-groups",getGroups);
// router.post("/send-message",sendMessage);
router.post("/get-group-msg",getGroupMessage);
router.post("/present-group-member",grouMembers)
router.post("/not-present-group-member",notInGroupMember)

router.post("/check-admin",checkAdmin)

router.post("/remove-member",removeMember)

router.post("/make-admin",makeAdmin)

router.post("/upload-img",upload.fields([
    {
        name: "img",
        maxCount: 1,
      },
]),uploadFile)

// router.post("/upload-img",(req,res)=>{
//   console.log(req.body)
// })


module.exports = router;