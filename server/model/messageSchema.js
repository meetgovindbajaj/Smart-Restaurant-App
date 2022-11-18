const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    table:{
        type:Number,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
  });

  const Message=mongoose.model("MESSAGE",messageSchema);
  module.exports=Message;