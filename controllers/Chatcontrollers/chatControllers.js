const Chat = require('../../model/chat')
const Message =require('../../model/message')
const adminUser =require('../../model/admin')

exports.createChat =async(req,res,next)=>{
    const { userId } = req.body;
    console.log(userId)

  if (!userId) {
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.data.adminId} } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-Password")
    .populate("latestMessage");


  isChat = await adminUser.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

   if (isChat.length > 0) {
     res.send(isChat[0]);
   } else {
     var chatData = {
       chatName: "sender",
       users: [req.data.adminId, userId],
     };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400).json({
          error:error.message
      })
    }
  }
}



exports.fetchChat =async(req,res,next)=>{
       try{
            Chat.find({ users: { $elemMatch: { $eq: req.data.adminId } } })
            .populate("users", "-Password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
            results = await adminUser.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results);
            });
      }catch(err){
        res.status(400).json({
            error:error.message
        })
      }
}



