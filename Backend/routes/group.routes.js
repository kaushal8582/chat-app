const {Router} = require("express");
const { createGroup, addMemberInGroup, getGroups, sendMessage, getGroupMessage, grouMembers, checkAdmin, notInGroupMember, removeMember, makeAdmin } = require("../controllers/group.controller");
const router = Router();


router.post("/create",createGroup);
router.post("/add-member-group/:groupId",addMemberInGroup);
router.post("/get-all-groups",getGroups);
router.post("/send-message",sendMessage);
router.post("/get-group-msg",getGroupMessage);
router.post("/present-group-member",grouMembers)
router.post("/not-present-group-member",notInGroupMember)

router.post("/check-admin",checkAdmin)

router.post("/remove-member",removeMember)

router.post("/make-admin",makeAdmin)


module.exports = router;