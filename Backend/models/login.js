const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    staffId: {
      type: String,
      required: [true, "Staff ID is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    staffName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "staff",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Staff = mongoose.model("Staff", userSchema);
module.exports = Staff;
