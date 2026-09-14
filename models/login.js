const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

  id:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  },
  staffName:{
    type:String,
  },
  phone:{
    type:String,
  },
  email:{
    type:String,
  },
  location:{
    type:String,
  },
  role:{
    type:String,
    default:'staff',
  },
  isActive:{
    type:Boolean,
    default:true,
  },
  isAdmin:{
    type:Boolean,
    default:false,
  }

},{
  timestamps:true,
});

const Staff = mongoose.model("Staff",Staff);
module.exports = Staff;