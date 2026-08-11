const jwt = require('jsonwebtoken')
const dotenv=require('dotenv').config()


const verifyMiddleware = (req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader){
        return res.status(401).json({error:"user not loggen in"})
    }
    const token=authHeader.replace('Bearer ','')
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decoded.userId
    }catch(error){
        return res.status(400).json({error:'invalid user'})
    }
    next()

}


module.exports=verifyMiddleware