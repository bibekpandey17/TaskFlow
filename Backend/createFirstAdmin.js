require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Staff = require("./models/login");

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const hashedPassword = await bcrypt.hash("admin@12345", 12);
  await Staff.create({
    staffId: "admin1",
    password: hashedPassword,
    staffName: "Ram",
    isAdmin: true,
    isActive: true,
  });
  console.log("First admin created");
  process.exit();
});