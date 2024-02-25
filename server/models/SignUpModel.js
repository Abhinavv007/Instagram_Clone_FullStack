import mongoose from "mongoose";
const SignUpSchema = mongoose.Schema({
    email:String,
    Fname:String,
    username:String,
    password:String,
    pic:String, 
    followers:[{type:mongoose.Schema.Types.ObjectId}],
    following:[{type:mongoose.Schema.Types.ObjectId}],


})
const SignUpModel = mongoose.model("SignUps",SignUpSchema)
export default SignUpModel