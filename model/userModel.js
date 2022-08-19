

import mongoose from "mongoose";
// import {isEmail} from "validator"
import bcrypt, { hash } from "bcrypt";



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:60,
        index:true,
        // validate:[isEmail,"invalid email"]
    },
    password:{
        type:String,
        required:true,
    },
    picture:{
        type:String,
       
    },
    newMessages:{
        type:Object,
        default:{},
    },
    status:{
        type:String,
        default:"online"
    }
},{minimize:false})

userSchema.pre("save",function(next){
    const user = this;
    if(!user.isModified("password")) return next();

    bcrypt.genSalt(10,function(err,salt){
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
        user.password=hash
        next()
    })
})
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject();
    delete userObject.password;
    return userObject
}

userSchema.statics.findByCredentials = async function (email,password){
    const user = await User.findOne({email})
    if(!user) throw new Error("invalid email or password")
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) throw new Error("invalid email or password")
return user
}

const User = mongoose.model("User", userSchema)

export default User

