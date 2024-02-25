import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import SignUpModel from "../models/SignUpModel.js"
dotenv.config()
const secretKey = process.env.SECRET_KEY

const verifyToken = (req,resp,next)=>{
    const auth = req.headers['authorization']
    
    if(auth!==undefined){
        const bearer = auth.split(" ")
        const token = bearer[1]
        jwt.verify(token,secretKey,async(err,decoded)=>{
            if(err) resp.json({msg:"Invalid Token"})
            else{
        const{userID} = decoded
        const userData =  await SignUpModel.findById(userID)
        req.user = userData
           next()
        }
        })
    } else{
     resp.json({msg:"Authorization Required"})
    }

}
export default verifyToken
