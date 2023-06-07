const mongoose = require("mongoose");
const User = require("./userModel");
const Message = require("./MessageModel");

// Create ChatRoom Schema
const chatRoomSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "must have a Sender ID"],
  },
  reciever: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "must have a Reciever ID"],
  },
  createAt: { type: Date, default: Date.now },
  Messages: [{ type: mongoose.Schema.ObjectId, ref: "Message" }],
});

/* ------------------- Start Mongoose Middleware ------------------- */
// Document Middleware  -  runs before create() and save()
chatRoomSchema.pre("save", async function (next) {
  this.populate({
    path: "sender",
    select: "-__v -passwordChangeAt -password -items -role -joinAt -phone",
  }); // populate sender field with all fields except __v, passwordChangedAt, password
  this.populate({
    path: "reciever",
    select: "-__v -passwordChangeAt -password -items -role -joinAt -phone",
  }); // populate reciever field with all fields except __v, passwordChangedAt, password
  this.populate({
    path: "Messages",
    select: "content date user",
  });
  next();
});

// Query Middleware  - runs before find()
chatRoomSchema.pre(/^find/, function (next) {
  this.populate({
    path: "sender",
    select: "-__v -passwordChangeAt -password -items -role -joinAt -phone",
  }); // populate sender field with all fields except __v, passwordChangedAt, password
  this.populate({
    path: "reciever",
    select: "-__v -passwordChangeAt -password -items -role -joinAt -phone",
  }); // populate reciever field with all fields except __v, passwordChangedAt, password
  this.populate({
    path: "Messages",
    select: "content date user",
  });
  next();
});

/* ------------------- End Mongoose Middleware --------------------- */

// Create ChatRoom Model
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
