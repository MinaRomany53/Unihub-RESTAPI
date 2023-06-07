const express = require("express");
const chatRoomsController = require("../Controllers/chatRoomsController");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, chatRoomsController.getMyAllChatRooms)
  .post(
    authController.protect,
    chatRoomsController.checkRoomExistence,
    chatRoomsController.createChatRoom
  );

router
  .route("/:chatRoomId")
  .get(authController.protect, chatRoomsController.getChatRoom)
  .delete(authController.protect, chatRoomsController.deleteChatRoom);

// Messages Route
router
  .route("/:chatRoomId/messages")
  .post(authController.protect, chatRoomsController.pushNewMessage);

module.exports = router;
