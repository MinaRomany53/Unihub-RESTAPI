const express = require("express");
const usersController = require("../Controllers/usersController");
const authController = require("../Controllers/authController");

const router = express.Router();

/////////////////////////////////////
/////// Authentication Routes ///////
/////////////////////////////////////
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

// User Actions
router.patch("/updatePassword", authController.updatMyPassword);
router.get("/me", usersController.getMe);
router.patch("/updateMe", usersController.updateMe);
router.delete("/deleteMe", usersController.deleteMe);

// Admin Actions
router
  .route("/")
  .get(authController.restrictTo("admin"), usersController.getAllUsers);
router
  .route("/:userId")
  .get(authController.restrictTo("admin"), usersController.getUser)
  .patch(authController.restrictTo("admin"), usersController.updateUser)
  .delete(authController.restrictTo("admin"), usersController.deleteUser);

module.exports = router;
