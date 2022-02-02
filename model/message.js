const mongoose =require('mongoose')

const messageSchema = mongoose.Schema(
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "adminUser" },
      message: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
      readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "adminUser" }],
    },
    { timestamps: true }
  );

  const Message =mongoose.model('Message',messageSchema)


  module.exports=Message