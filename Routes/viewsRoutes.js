const express = require("express");
const viewsController = require("../Controllers/viewsController");

const router = express.Router();

router.get("/search", viewsController.viewSearchedItems);
router.get("/item/:itemId", viewsController.getItemPage);
router.get("/", viewsController.getHomePage);

module.exports = router;
