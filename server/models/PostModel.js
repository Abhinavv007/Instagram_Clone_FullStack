import mongoose from "mongoose";
const PostSchema = mongoose.Schema({
    file:String,
    caption:String,
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"SignUps"}],
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SignUps"
    },
    comments:[{
        text:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"SignUps"}
    }
    ]
    
})
const PostModel = mongoose.model("Posts",PostSchema)
export default PostModel