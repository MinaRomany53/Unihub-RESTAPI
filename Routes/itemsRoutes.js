const express = require("express");
const itemsController = require("../Controllers/itemsController");
const authController = require("../Controllers/authController");

const router = express.Router();

router
  .route("/Category-Stats")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    itemsController.getCategoryStats
  );

router
  .route("/Not-Approved-Items")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    itemsController.getNotApprovedItems
  );

router
  .route("/Not-Approved-Items/:itemId")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    itemsController.approveItem
  );

// Search - Feature
router.route("/search/:searchTitle").get(itemsController.searchByTitle);

// Favorite Items - Feature
router
  .route("/Fav-Items")
  .get(authController.protect, itemsController.getAllFavItems);
router
  .route("/Fav-Items/:itemId")
  .patch(authController.protect, itemsController.updateFavItem);

router
  .route("/")
  .get(itemsController.getAllItems)
  .post(authController.protect, itemsController.addNewItem);

router
  .route("/:itemId")
  .get(itemsController.getItem)
  .patch(authController.protect, itemsController.updateItem)
  .delete(authController.protect, itemsController.deleteItem);

module.exports = router;
