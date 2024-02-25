import express from "express"
import cors from "cors"
import router from "./routes/userRoutes.js"
import dbConnect from "./config/db.js"
dbConnect()
const app = express()

app.use(cors())
app.use(express.static("public/upload"))
app.use(express.json())
app.use("/api",router)
app.listen(9000,()=>console.log("Server Started"))

  