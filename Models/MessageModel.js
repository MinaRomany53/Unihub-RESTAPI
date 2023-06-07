const mongoose = require("mongoose");
const User = require("./userModel");
const ChatRoom = require("./chatRoomModel");

// Create Message Schema
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Message can't be empty"],
    trim: true,
    maxlength: [300, "Message can't be more than 1000 characters"],
    minlength: [1, "Message can't be empty"],
  },
  date: { type: Date, default: Date.now },
  chatRoom: {
    type: mongoose.Schema.ObjectId,
    ref: "ChatRoom",
    required: [true, "Message must have a ChatRoom ID"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Message must have a user ID"],
  },
});

/* ------------------- Start Mongoose Middleware ------------------- */
// Document Middleware  -  runs before create() and save()
messageSchema.pre("save", async function (next) {
  this.populate({
    path: "user",
    select:
      "-__v -passwordChangeAt -password -items -role -joinAt -phone -email",
  });
  next();
});

// Query Middleware  - runs before find()
messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select:
      "-__v -passwordChangeAt -password -items -role -joinAt -phone -email",
  });
  next();
});

/* ------------------- End Mongoose Middleware --------------------- */

// Create ChatRoom Model
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
