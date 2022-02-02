const express  =require('express')
const authController =require('../../controllers/authController/authController')
const isAuthentication  =require('../../middleware/authication')

const router =express.Router()    


router 
   .route('/pages-register')
   .post(authController.signup)


router
    .route('/login')
    .post(authController.login)   



router
     .route('/dashboard')
     .get(
          isAuthentication,
          authController.dashboard
        )   


router
    .route('/changepassword')
    .post(isAuthentication,
        authController.ChangePassword
        )        




   module.exports=router