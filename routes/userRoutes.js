

import express from "express"
import User from "../model/userModel.js"
// import { register,login,getAllusers } from "../controllers/usersController.js"


const router = express.Router()

router.post("/register",async(req,res)=>{
    try{
        const {userName,email,password,picture}=req.body
        console.log(userName,email,password,picture)
        const user = await User.create({name:userName,email,password,picture})
        res.status(201).json(user)
    }catch(error){
        let msg;
    if(error.code == 11000){
      msg = "User already exists"
    } else {
      msg = error.message;
    }
    console.log(error);
    res.status(400).json(msg)
    }
})

router.post('/login', async(req, res)=> {
    try {
      const {email, password} = req.body;
      const user = await User.findByCredentials(email, password);
      user.status = 'online';
      await user.save();
      res.status(200).json(user);
    } catch (e) {
        res.status(400).json(e.message)
    }
  })


// router.post("/login",async(req,res)=>{
// try{
//     const {email,password}=req.body;
//     const user = await User.findByCredentials(email,password)
//     user.status = "online";
//     await user.save();
//     res.status(200).json(user)

// }catch(error){
//     res.status(400).json("on login rout 2" , error.message)
// }
// })


// router.get("/Chat/:id",getAllusers)





export default router ;




