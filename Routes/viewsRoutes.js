const express = require("express");
const viewsController = require("../Controllers/viewsController");

const router = express.Router();

router.get("/search", viewsController.viewSearchedItems);
router.get("/", viewsController.getHomePage);
router.get("/:category", viewsController.viewMoreItems);

module.exports = router;
