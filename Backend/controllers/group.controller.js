const { Op } = require("sequelize");
const Group = require("../models/group.models");
const GroupMessage = require("../models/message.model");
const UserGroup = require("../models/UsersGroups.model");
const Database = require("../utils/database");
const User = require("../models/user.model")

module.exports.createGroup = async (req, res) => {
  const t = await Database.transaction();
  const { name, userId } = req.body;
  try {
    if (!name || !userId) {
      return res.status(200).json({ message: "All fields are required" });
    }

    const group = await Group.create(
      {
        name: name,
        createdBy: userId,
      },
      { transaction: t }
    );

    if (!group) {
      return res
        .status(500)
        .json({ message: "something went wrong while creating group" });
    }

    const usergroupCreated = await UserGroup.create(
      {
        UserId: userId,
        GroupId: group.id,
        role: "admin",
      },
      { transaction: t }
    );

    if (!usergroupCreated) {
      return res
        .status(500)
        .json({ message: "something went wrong while creating group" });
    }

    await t.commit();

    res.status(200).json({ message: "created group", data: group });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

module.exports.addMemberInGroup = async (req, res) => {
  const { role, userId } = req.body;
  const { groupId } = req.params;

  if (!role || !userId || !groupId) {
    return res.status(404).json({ message: "all fields are required" });
  }
  const t = await Database.transaction();

  try {
    //bulk create
    const userAdded = await UserGroup.create(
      {
        UserId: userId,
        GroupId: groupId,
        role: role,
      },
      { transaction: t }
    );

    if (!userAdded) {
      return res
        .status(500)
        .json({ message: "something went wrong while added member" });
    }

    await t.commit();
    res.status(200).json({ message: "added member", data: userAdded });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

module.exports.getGroups = async (req, res) => {
  const { userid } = req.body;
  console.log(userid)
  try {
    const allGroups = await UserGroup.findAll({
      where: {
        UserId: userid,
      },
      attributes:["GroupId"]

    });

    let value =(allGroups.map((item)=>item.GroupId));

    if (!value.length>0) {
      return res.status(404).json({ message: "not have any group" });
    }
    console.log(value)

    const allgp  = await Group.findAll({
        where:{
            id:{
                [Op.in]:value
            }
        },
        attributes:["name","createdBy","id"],
    })

    return res
      .status(200)
      .json({ message: "finded all group", Data: allgp });
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendMessage = async (req, res) => {
  const { groupId, senderId, msg } = req.body;
  if (!groupId || !senderId || !msg) {
    return res.status(404).json({ message: "all fields are required" });
  }

  try {
    const messageSend = await GroupMessage.create({
      groupId,
      senderId,
      content: msg,
    });

    if (!messageSend) {
      return res
        .status(500)
        .json({ message: "something went wrong while send message" });
    }

    return res.status(200).json({ message: "send" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getGroupMessage = async (req, res) => {  
  const { groupId } = req.body;
  try {
    const allMessage = await GroupMessage.findAll({
      where: {
        groupId: groupId,
      },
      order: [["createdAt", "ASC"]],
    });

    if (!allMessage.lengt > 0) {
      return res
        .status(200)
        .json({ message: "finded all msg", data: allMessage });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkAdmin = async(req,res)=>{
  const {groupid,userid} = req.body;

  try {
    const user = await UserGroup.findOne({
      where:{
        groupId:groupid,
        userId:userid
      }
    })

    if(user.role=="admin"){
      return res.status(200).json({message:"admin",data:true})
    }
    return res.status(200).json({message:"member",data:false})

  } catch (error) {
    console.log(error)
  }
}



// [Op.notIn]

module.exports.grouMembers =async(req,res)=>{
  const {groupid} = req.body;
  try {
    const response = await UserGroup.findAll({
      where:{
        groupId:groupid
      },
      attributes:["UserId","role"]
    })

    let presentId = response.map((item)=>item.UserId)

    const presentUser = await User.findAll({
      where:{
        id:{
          [Op.in]:presentId
        }
      },
      attributes:["name",'id']
    })

    let members = presentUser.map((item)=>{
      console.log(item)
      let roleData = response.find((res)=> res.UserId===item.id )
      return{
        name:item.name,
        id:item.id,
        role:roleData?roleData.role:null
      }
    })


    return res.status(200).json({message:"fetched successfully",data:members})

  } catch (error) {
    console.log(error)
  }
}

module.exports.notInGroupMember = async(req,res)=>{
  const {groupid} = req.body;
  console.log(groupid)
  try {
    const response = await UserGroup.findAll({
      where:{
        groupId:groupid
      },
      attributes:["UserId"]
    })

    let presentId = response.map((item)=>item.UserId)

    const presentUser = await User.findAll({
      where:{
        id:{
          [Op.notIn]:presentId
        }
      },
      attributes:["name",'id']
    })


    return res.status(200).json({message:"fetched successfully",data:presentUser})

  } catch (error) {
    console.log(error)
  }
}



module.exports.removeMember = async(req,res)=>{
  const {groupid,userid} = req.body;

  try {
    const response = await UserGroup.destroy({
      where:{
        GroupId:groupid,
        UserId:userid
      }
    })

    if(!response){
      return res.status(200).json({message:"something went wrong while remove member"})
    }

    res.status(200).json({message:"remove successfully"})

  } catch (error) {
    console.log(error)
  }

}


module.exports.makeAdmin = async(req,res)=>{
  const {userid,groupid} = req.body;


  try {
    const response = await UserGroup.update(
      { role: "admin" }, // Values to update
      { 
        where: { 
          GroupId: groupid, 
          UserId: userid 
        } 
      }
    );
    

    if(!response){
      return res.status(500).json({message:"something went wrong while make admin"});
    }

    res.status(200).json({message:"successfully make admin"});

  } catch (error) {
    console.log(error)
  }


}