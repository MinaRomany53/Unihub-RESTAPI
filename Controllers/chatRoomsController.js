const ChatRoom = require("../Models/chatRoomModel");
const Message = require("../Models/MessageModel");
const ApiErrors = require("../Utils/apiErrors");

exports.checkRoomExistence = async (req, res, next) => {
  try {
    const chatRoom = await ChatRoom.findOne({
      sender: req.currentUser._id,
      reciever: req.body.reciever,
    });
    const chatRoom_2 = await ChatRoom.findOne({
      reciever: req.currentUser._id,
      sender: req.body.reciever,
    });
    if (chatRoom || chatRoom_2) {
      return res.status(200).json({
        status: "Success - ChatRoom Already Exist",
        date: req.date,
        chatRoom: chatRoom || chatRoom_2,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.createChatRoom = async (req, res, next) => {
  try {
    const body = {
      sender: req.currentUser._id,
      reciever: req.body.reciever,
    };
    const chatRoom = await ChatRoom.create(body);
    res.status(201).json({
      status: "Success",
      date: req.date,
      chatRoom: chatRoom,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyAllChatRooms = async (req, res, next) => {
  try {
    const chatRooms = await ChatRoom.find({
      $or: [{ reciever: req.currentUser._id }, { sender: req.currentUser._id }],
    });
    res.status(200).json({
      status: "Success",
      date: req.date,
      results: chatRooms.length,
      chatRooms: chatRooms,
    });
  } catch (err) {
    next(err);
  }
};

exports.getChatRoom = async (req, res, next) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.chatRoomId);

    if (!chatRoom) return next(new ApiErrors(404, `Invalid ID !`));
    if (
      chatRoom.sender.email !== req.currentUser.email &&
      chatRoom.reciever.email !== req.currentUser.email
    )
      return next(
        new ApiErrors(
          401,
          `You are not allowed to Access this chat room ! - Please Login First.`
        )
      );

    res.status(201).json({
      status: "Success",
      date: req.date,
      chatRoom: chatRoom,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteChatRoom = async (req, res, next) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.chatRoomId);
    if (!chatRoom) return next(new ApiErrors(404, `Invalid ID !`));
    if (chatRoom.sender.email !== req.currentUser.email)
      return next(
        new ApiErrors(
          401,
          `You are not allowed to delete this chat room ! - Please Login First.`
        )
      );

    const deletedChatRoom = await ChatRoom.findByIdAndDelete(
      req.params.chatRoomId
    );

    res.status(204).json({
      status: "Success",
      date: req.date,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Messages Route
exports.pushNewMessage = async (req, res, next) => {
  try {
    const chatRoomExist = await ChatRoom.findById(req.params.chatRoomId);
    if (!chatRoomExist) return next(new ApiErrors(404, `Invalid ID !`));
    if (
      chatRoomExist.sender.email !== req.currentUser.email &&
      chatRoomExist.reciever.email !== req.currentUser.email
    )
      return next(
        new ApiErrors(
          401,
          `You are not allowed to Access this chat room ! - Please Login First.`
        )
      );

    const body = {
      user: req.currentUser._id,
      chatRoom: req.params.chatRoomId,
      content: req.body.content,
    };
    const newMessage = await Message.create(body);
    await ChatRoom.findOneAndUpdate(
      { _id: req.params.chatRoomId },
      { $push: { Messages: newMessage._id } }
    );

    const chat = await ChatRoom.findById(req.params.chatRoomId);

    res.status(201).json({
      status: "Success",
      date: req.date,
      messages: chat.Messages,
    });
  } catch (err) {
    next(err);
  }
};
