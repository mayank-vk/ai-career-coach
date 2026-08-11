const bcrypt=require('bcrypt')
const userModel=require('../models/User')
const dotenv=require('dotenv').config();
const jwt=require('jsonwebtoken')


const authControl= async (req,res)=>{
    const {email,password}=req.body
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser= new userModel({
            email: email,
            password: hashedPassword,
        })
        await newUser.save()
        return res.status(200).json({success:true,message:"new user added!"})
    }catch(err){
        return res.status(400).json({error:"email already exists!"})
    }
}


const loginControl = async (req,res)=>{

    const {email,password}=req.body
    //check if user exxists
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({error:"invalid email or password"})
        }
    //cheeck if password matches
        if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.status(200).json({token})
        }
        else{
            return res.status(400).json({error:"invalid email or password"})
        }

    }catch(error){
        res.status(400).json({success:false,error:error,message:"invalid username/password"})
    }
}

module.exports = { authControl,loginControl }
