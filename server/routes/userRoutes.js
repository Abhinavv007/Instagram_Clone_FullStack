import express from "express";
import multer from "multer"
import authController from "../controllers/authController.js"
import verifyToken from "../middleware/authMiddleware.js";
const router = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/upload`)
    },
    filename: function (req, file, cb) {
      
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })

router.post("/signup",upload.single("pic"),authController.SignUp)
router.post("/login",authController.LogIn)
router.get("/posts",verifyToken,authController.getAllPosts)
router.get("/mypost/",verifyToken,authController.myPost)
router.put("/comment/:id",verifyToken,authController.Comment)
router.put("/like/:id",verifyToken,authController.Like)
router.put("/unlike/:id",verifyToken,authController.Unlike)
router.delete("/delete/:id",verifyToken,authController.DeletePost)
router.post("/create-post",verifyToken,upload.single("file"),authController.CreatePost)
router.get("/profile-pic",verifyToken,authController.ProfilePic)
router.put("/follow/:id",verifyToken,authController.follow)
router.put("/unfollow/:id",verifyToken,authController.unfollow)
router.get("/get-user-profile/:id",authController.getUserProfile)
router.put("/update-profile-pic",verifyToken,upload.single("pic"),authController.UpdateProfilePic)

export default router
