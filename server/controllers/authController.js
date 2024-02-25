import SignUpModel from "../models/SignUpModel.js"
import PostModel from "../models/PostModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

class userController {
    static SignUp = async (req, resp) => {
        try {
            const { email, Fname, username, password } = req.body;
    
            let picFileName = ""; 
    
            if (req.file && req.file.filename) {
                picFileName = req.file.filename; 
            }
    
            if (email && Fname && username && password) {
                const checkEmail = await SignUpModel.findOne({ email });
                if (!checkEmail) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = new SignUpModel({
                        email,
                        Fname,
                        username,
                        password: hashedPassword,
                        pic: picFileName 
                    });
                    const result = await newUser.save();
                    return resp.json({ msg: "SignUp Successfully Done.", pic: picFileName });
                } else {
                    return resp.json({ msg: "Email already exists." });
                }
            } else {
                return resp.json({ msg: "All fields are required." });
            }
        } catch (error) {
            return resp.json({ msg: error.message });
        }
    };
    
    static LogIn = async (req, resp) => {
        const {email,password} = req.body

        try {
            if(email && password){
                const check =  await SignUpModel.findOne({email})
                if(check){
                    if(check.email===email && await bcrypt.compare(password,check.password)){
                       const token = jwt.sign({userID:check._id},process.env.SECRET_KEY,{expiresIn:"1d"})
                        resp.json({msg:"Logged In Successfully.",token,name:check.username,id:check._id})
                    } else{
                    resp.json({msg:"Incorrect Email or Password"})

                    }
                 } else{
                resp.json({ msg: "Account with this email doesn't exists" })

                }

            } else{
             resp.json({ msg: "All fields are required" })

            }
        } catch (error) {
            resp.json({ msg: error.message })
        }


    }
    static CreatePost = async (req, resp) => {
        const { filename } = req.file;
        const { caption } = req.body;
        try {
          
            if (caption) {
                const newPost = new PostModel({
                    file: filename,
                    caption,
                    postedBy: req.user 
                });
                await newPost.save();
                req.user.password=undefined
                resp.json({ msg: "Post created successfully.", file: filename, caption, postedBy: req.user });
            } else {
                resp.json({ msg: "Please fill the caption." });
            }
        } catch (error) {
            resp.json({ msg: error.message });
        }
    }
    
       static getAllPosts = async(req,resp)=>{
        try {
            const allPosts = await PostModel.find({}).populate("postedBy","_id username Fname pic")
            if(allPosts){
          resp.json({ msg: allPosts })


            } else{
         resp.json({ msg: "No Post Found" })

            }
            
        } catch (error) {
        resp.json({ msg: error.message })
            
        }

       }
       static myPost = async(req,resp)=>{
        try {
    const post = await PostModel.find({postedBy:req.user._id}).populate("postedBy","_id  Fname followers following")
            resp.json({msg:post})
        } catch (error) {
        resp.json({ msg: error.message })
            
        }
       }
       static Like = async (req, resp) => {
        const { id } = req.params;
        try {
            const result = await PostModel.findByIdAndUpdate(id, {
                $push: { likes: req.user._id }
            }, { new: true });
            const likesCount = result.likes.length;

            resp.json({ msg: likesCount });
        } catch (error) {
            resp.status(500).json({ error: "Error updating post with like" });
        }
    }
    static Unlike = async (req, resp) => {
        const { id } = req.params;
        try {
            const result = await PostModel.findByIdAndUpdate(id, {
                $pull: { likes: req.user._id }
            }, { new: true });
            const likesCount = result.likes.length;

            resp.json({ msg: likesCount });
        } catch (error) {
            resp.status(500).json({ error: "Error updating post with like" });
        }
    }
    static Comment = async (req, resp) => {
        const { id } = req.params;
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        };
        try {
            const result = await PostModel.findByIdAndUpdate(
                id,
                { $push: { comments: comment } },
                { new: true }
            ).populate({
                path: 'comments',
                populate: {
                    path: 'postedBy',
                    select: 'username Fname'
                }
            });
            console.log(result);
            resp.json({ msg: result });
        } catch (error) {
            console.error(error);
            resp.status(500).json({ msg: error.message });
        }
    };
    
    static DeletePost = async(req,resp)=>{
        try {
            const {id} = req.params

            await PostModel.findByIdAndDelete(id)
            resp.json({msg:"Post Deleted Successfully"})

          
            
        } catch (error) {
            resp.status(500).json({ msg:error.message });

            
        }
    }
    static ProfilePic = async (req, res) => {
        try {
                const userId = req.user._id; 
    
                const user = await SignUpModel.findById(userId).select('pic');
        
                if (!user) {
                    return res.status(404).json({ msg: 'User not found.' });
                }
        
                res.json({ msg: user.pic });

            
            
           
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
    static UpdateProfilePic = async(req,res)=>{
        try {
            const { filename } = req.file;
            const userId = req.user._id; 

            
            const updatedUser = await SignUpModel.findByIdAndUpdate(userId, { pic:filename }, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ msg: 'User not found.' });
            }

            return res.json({ msg: 'Profile picture updated successfully.'});
        } 
         catch (error) {
            res.status(500).json({ msg: error.message });
            
        }
    }
    static getUserProfile = async(req,resp)=>{
    try {
        const {id} = req.params
        const user = await PostModel.find({postedBy:id}).populate("postedBy", "Fname pic followers following")
        resp.json({msg:user})

 
    } catch (error) {
        resp.status(500).json({ msg: error.message });

        
    }
    }
    static follow = async(req,resp)=>{
        try {
            const {id} = req.params
          let result =   await SignUpModel.findByIdAndUpdate(id,{
                $push:{followers:req.user._id}
            },{new:true})
           result = await SignUpModel.findByIdAndUpdate(req.user._id,{
                $push:{following:id}
            },{new:true})
            resp.json({msg:result})

            
        } catch (error) {
        resp.status(500).json({ msg: error.message });
            
        }
    }
    static unfollow = async(req,resp)=>{
        try {
            const {id} = req.params
           let result= await SignUpModel.findByIdAndUpdate(id,{
                $pull:{followers:req.user._id}
            },{new:true})
            result = await SignUpModel.findByIdAndUpdate(req.user._id,{
                $pull:{following:id}
            },{new:true})
            resp.json({msg:result})
            
        } catch (error) {
        resp.status(500).json({ msg: error.message });
            
        }
    }
}
export default userController