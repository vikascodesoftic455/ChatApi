const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt');


const adminSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please Provide your email'],
        trim:true,
        unique:[true,'This Email is Already registerd && Please fill to an another Email '],
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    username:{
        type:String,
        required:[true,'Please Provide your UserName'],
        trim:true,
        unique:[true,'This Username is Already registerd && Please fill to an another Username '],
        lowercase:true,
    },
    PhoneNumber:{
     type:Number,
     required:[true,'Please Provide Your PhoneNumber'],
     min:10
    },
    photo:{ 
        type:String,
        default:'default.jpg'
    },
    
    Password:{
        type:String,
        required:[true,'Please provide a  password'],
        minlength:8,
        select:false
    },
    PasswordCofirm:{
        type:String,
        required:[true,'Please confirm your password'],
        minlength:8,
        validate:{
            validator:function(Cpassword){
                return Cpassword===this.Password
            },
            message:"Password are not the same "
        } 
    },
    PasswordChangedAt:{type:Date,select:false},
    active:{
        type:Boolean,
        default:true,
        select:false
    }

}) 


adminSchema.pre("save", async function(next){
    //Only run this function if the password was actually modified
    if(!this.isModified("Password"))return next()
   
    // hash the password with cost of 10
      this.Password  = await bcrypt.hash(this.Password,10)
   
      // Delete password  with PasswordCofirm filed  
      this.PasswordCofirm = undefined
    
    next()
})
 
adminSchema.pre("save", async function(next){
    if(!this.isModified("Password")||this.isNew)return next()
    this.PasswordChangedAt =Date.now()-1000
    next()
})


//Compare the Password
adminSchema.methods.correctPassword = async function(
    candidatePassword,userpassword
    ) 
    {
        console.log(candidatePassword,userpassword,"vikascsdgkbv")
    return await bcrypt.compare(candidatePassword,userpassword)
    }



const adminUser =new mongoose.model('adminUser',adminSchema)

module.exports =adminUser