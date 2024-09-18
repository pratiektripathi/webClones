import express from "express"
import dotenv from "dotenv"
import path from "path"


dotenv.config();

const app = express()
const port = process.env.PORT;
const key = "pateek"

app.use(express.static(("public")));


const mid =(req,res,next)=>{
    key==="prateek" ? next() : res.redirect("/signin")
  }

app.get("/",mid,(req,res)=>
res.sendFile(path.resolve("frontend","index.html")))

app.get("/signup",(req,res)=>{
  res.sendFile(path.resolve("frontend","signup.html"))
 
})


app.get("/api/signin",mid,(req,res)=>{
  res.send("hello");
})

app.get("/signin",(req,res)=>{
  res.sendFile(path.resolve("frontend","signin.html"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})