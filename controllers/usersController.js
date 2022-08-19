
// import Users from "../model/userModel.js"
// import bcrypt from "bcrypt";



// export  const register = async (req,res)=>{
//     try{
//     const {username,email,password}=req.body
//     const usernameCheck = await Users.findOne({username:username})
//     if(usernameCheck){
//         return res.json({msg:"username already used",status:false})
//     }
//     const emailCheck = await Users.findOne({email:email})
//     if(emailCheck){
//         return res.json({msg:"Email already used",status:false})
//     }
//     const hashedpassword= await bcrypt.hash(password,10)
//     const user = await Users.create({
//         username:username,
//         email:email,
//         password:hashedpassword
//     })
//     return res.json({status:true,user})
// }catch(error){
//     console.log(error.message ," in adding user")
// }
// }
// export  const login = async (req,res)=>{
//     try{
//     const {email,password}=req.body
//     // const usernameCheck = await Users.findOne({username:username})
//     // if(usernameCheck){
//     //     return res.json({msg:"username already used",status:false})
//     // }
//     const emailCheck = await Users.findOne({email:email})
//     if(!emailCheck){
//         return res.json({msg:"Email id is invalid",status:false})
//     }
//     const isPAsswordmatch=await bcrypt.compare(password,emailCheck.password)
//     if(!isPAsswordmatch){
//         return res.json({msg:"incorrect password",status:false})
//     }
   
//     return res.json({status:true,emailCheck})
// }catch(error){
//     console.log(error.message ," in adding user")
// }
// }


// export const getAllusers = async (req,res)=>{
//     try{
// const users = await Users.find({_id:{$ne:req.params.id}}).select([
//     "email",
//     "username",
//     "_id"
// ])
// return res.json(users)
//     }catch(error){
//         console.log(error,"on get all users")
//     }
// }

