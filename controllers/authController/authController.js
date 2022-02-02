const adminUser =require('../../model/admin')
const jwt =require('jsonwebtoken')
const SecretKey ="vhdscsjfcsufjscvsvcsakvcMcvgwgad"

exports.signup =async(req,res,next)=>{

     try{
        const {name,email,username,PhoneNumber,Password,PasswordCofirm} =req.body
         adminUser.findOne({email:email}&&{username:username}&&{PhoneNumber:PhoneNumber},(err,user)=>{
              if(user){
                   res.status(202).json({
                        status:"Accepted",
                        message:'user Already is Register',
                        HowToCreateUsreSignup:req.requestTime,
                   })
              }else{
               const newadminUser = new adminUser({
                    name,
                    email,
                    username,
                    PhoneNumber,
                    Password,
                    PasswordCofirm
                  })
                newadminUser.save(err=>{
                     if(err){
                      res
                         .status(500)
                         .json({
                         status:"fail",
                         message:err,
                         HowToCreateUsreSignup:req.requestTime
                     })
                     }else{
                         res
                           .status(201) 
                           .json({
                              status:"Sucess",
                              message:'Admin Reqisterd Sucessfully',
                              HowToCreateUsreSignup:req.requestTime,
                           })
                     }
                })
                
                  
              }
         })
          
     }catch(err){
          res
          .status(500)
          .json({
          status:"fail",
          message:err,
          HowToCreateUsreSignup:req.requestTime
      })
     }
}


exports.login =async(req,res,next)=>{
      try{ 
            const {email,password} =req.body
            if(!email || !password){
               res
                 .send(400)
                  .json({
                        message:'please provide the email && password',
                        satusCode:400
                    })
            }
            const admin =await adminUser.findOne({email:email}).select('+Password')
            const correct = await admin.correctPassword(password,admin.Password)
            if(correct==true){
                 console.log('hello softic')
                var token = jwt.sign({
                    adminId:admin.id,
               },SecretKey,{ expiresIn :'1h' })
                  
               res
                    .status(202)
                    .json({
                         statuscode:202,
                         message:"Admin Login SucessFully",
                         admin,
                         token
               } )

            }else{
                 console.log("hello code")
                 res.status(401).json({
                      satusCode:401,
                      message:'Incorrect the email && password',
                 })
            }
      }catch(err){
         res
          .status(500)
          .json({
               status:"fail",
               message:err,
               HowToCreateUsreSignup:req.requestTime
         })
      }
}


exports.dashboard =async(req,res,next)=>{
     try{
          const id =req.data.adminId
          const adminData =await adminUser.findOne({_id:id})
          console.log(adminData)
         if(!adminData){
             res.status(401).json({satusCode:401,message:'Unauthorized admin '})
         }else{
             res.status(201).json({satusCode:201,message:'Authorized Admin',adminData})
         }
            
     }catch(err){
          res.status(500).json({
               satusCode:500,
               message:'Failed && Internal Server Error and Please Try Again',
     
          })
     }
}



exports.ChangePassword  =async(req,res,next)=>{
  try{

    const {oldPassword,newPassword,confirmNewpassword}=req.body
         if(newPassword===confirmNewpassword){
               if(oldPassword!=newPassword){
                  const admin = await adminUser.findById({_id:req.data.adminId}).select('+Password')
                   admin.Password =newPassword
                   admin.PasswordCofirm=confirmNewpassword
                   await admin.save()
                   res.status(201).json({
                        message:'Password changed SucessFully'
                   })
               }
         }else{
              res.status(405).json({
                   statuscode:405,
                   message:"New Password and confirm password are not same "
              })
         }         
  }catch(err){
       console.log(err)
          //   res.status(400).json({
          //        status:"fail",
          //        HowToCreateUsreSignup:req.requestTime,
          //        data:{
          //          err
          //        }
          //   })
       }
}