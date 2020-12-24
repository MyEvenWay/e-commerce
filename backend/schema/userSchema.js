const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  username:{
    type: String,
  },
  email:{
    type: String,
  },
  phone:{
    type: Number,
  },
  password:{
    type: String,
  }
}, { timestamps:true } )

const User = mongoose.model("User", UserSchema )

module.exports = User

