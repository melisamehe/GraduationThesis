const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["user", "superadmin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);
module.exports = User;