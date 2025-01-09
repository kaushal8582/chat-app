
const JWT = require("jsonwebtoken");
const User = require("../models/user.model")


module.exports.authentaction = async(req,res,next)=>{
    const token = req.header("Authorization");
    if(!token){
        return res.status(401).json({message:"Not authorized"})
    }

   try {
    let data =  JWT.verify(token,process.env.JWT_SECRET_KEY)
    let user  = await User.findOne({where:{
        id:data.id
    }})

    if(!user){
        return res.status(401).json({message:"Unauthorized"});
    }

    req.user = user;
    next();

   } catch (error) {
    console.log(error)
   }


}