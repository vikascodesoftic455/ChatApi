 require('dotenv').config()
 const express =require('express')
 const crors =require('cors')
 const dbconn =require('./db/db')
 const adminRoutes =require('./router/Adminrouter/adminRoutes')
 const chatRoutes =require('./router/chatRouter/chatRoutes')
 const messageRoutes =require('./router/messageRouter/messageRoutes')
 const app =express()


 /// Server that can be start
const port  =5000


 // Body parser,rendering data body into req.body
app.use(express.urlencoded({extended:false,limit:'100kb'}))
app.use(express.json({limit:'100kb'}))

//Test middleware             
const logger =(req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
}
app.use(logger)

app.use(crors({
    origin: 'http://localhost:3000',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))

// //Routes
 app.use('/',adminRoutes)
 app.use('/api/chat',chatRoutes)
 app.use("/api/message", messageRoutes)

 app.listen(port,()=>console.log(`app is running on ${port}`))




