const User = require("../models/user.model")
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken")


module.exports.registerUser = async(req,res)=>{
    const {name,email,phone,password}  = req.body
    
    try {
        if([name,email,phone,password].some((item)=> item.trim()=="")){
            return res.status(400).json({message:"All fields are required"});
        }

        console.log(email)

        const existingUser = await User.findOne({where:{email:email}})
    
        if(existingUser){
            return res.status(400).json({message:"User allready exist"});
        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashPassword,
            phone
        })

        
        const userCreated = await User.findOne({where:{id:user.id}})

        res.status(201).json({message:"User Register successfully",data:userCreated})

        
    } catch (error) {
        console.log(error)
    }
    


}


module.exports.loginUser = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
   try {
    const user = await User.findOne({where:{
        email:email
    }})

    if(!user){
        return res.status(404).json({message:"User does not exist"});
    }
    const comparePassword=  bcrypt.compare(password,user.password);
    if(!comparePassword){
        return res.status(401).json({message:"Invalid Credintals"});
    }
    const token =  JWT.sign({id:user.id,email:user.email},process.env.JWT_SECRET_KEY)
    return res.status(200).json({message:"User login successfully ", token:token,id:user.id})


   } catch (error) {
    console.log(error)    
   }


}

module.exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email"], 
      });
  
      return res.status(200).json({ message: "Users fetched successfully!", data: users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch users.", error });
    }
  };
  