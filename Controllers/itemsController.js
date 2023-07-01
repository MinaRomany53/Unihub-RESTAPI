const Item = require("../Models/itemModel");
const User = require("../Models/userModel");
const ApiFeatures = require("../Utils/apiFeatures");
const ApiErrors = require("../Utils/apiErrors");
const multer = require("multer");
const sharp = require("sharp");

// Start Multer Config midddlware

const multerStorage = multer.memoryStorage(); // save image as buffer in the memory until we resize it

const multerFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiErrors(400, "Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadItemImages = upload.fields([
  { name: "coverImg", maxCount: 1 },
  { name: "imgs", maxCount: 5 },
]);
// End Multer Config midddlware

// Start Sharp Config midddlware for resize image
exports.resizeItemImages = async (req, res, next) => {
  if (!req.files.coverImg || !req.files.imgs) return next();

  // 1) Cover Image
  req.body.coverImg = `item-${req.currentUser.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.coverImg[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/items/${req.body.coverImg}`);

  // 2) Images
  req.body.imgs = [];

  await Promise.all(
    req.files.imgs.map(async (file, i) => {
      const filename = `item-${req.currentUser.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/imgs/items/${filename}`);

      req.body.imgs.push(filename);
    })
  );

  next();
};
// End Sharp Config midddlware for resize image

exports.getCategoryStats = async (req, res, next) => {
  try {
    const statistics = await Item.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: "$category",
          Number_Of_Items: { $sum: 1 },
          Max_Price: { $max: "$price" },
          Min_Price: { $min: "$price" },
          Items: { $push: "$title" },
        },
      },
      {
        $sort: { Number_Of_Items: -1 },
      },
    ]);

    res.status(200).json({
      status: "Success",
      date: req.date,
      results: statistics.length,
      data: {
        statistics: statistics,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllItems = async (req, res, next) => {
  try {
    // Build Query step by step ( 1.Filtering  2.Sorting  3.Field Limiting  4.Pagination )
    const features = new ApiFeatures(
      Item.find({ approved: { $ne: false } }),
      req.query
    )
      .filter()
      .paginate()
      .sort()
      .limitFields();

    // Execute Query
    const items = await features.query;

    // calc noOfItems & send it to the client for pagination
    const noOfItems = await Item.countDocuments({ approved: { $ne: false } });

    // Send response (end req-res cycle)
    res.status(200).json({
      status: "Success",
      date: req.date,
      TotalItems: noOfItems, // for pagination
      results: items.length,
      data: {
        items: items,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.addNewItem = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      user: req.currentUser._id,
    };
    const newItem = await Item.create(body);
    await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $push: { items: newItem._id } }
    );
    res.status(201).json({
      status: "Success",
      date: req.date,
      item: newItem,
    });
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(200).json({
      status: "Success",
      date: req.date,
      data: { item: item },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(200).json({
      status: "Success",
      date: req.date,
      data: { item: item },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(204).json({
      status: "Success",
      date: req.date,
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Approve Items - Admin Panel
exports.getNotApprovedItems = async (req, res, next) => {
  try {
    // Build Query step by step ( 1.Filtering  2.Sorting  3.Field Limiting  4.Pagination )
    const features = new ApiFeatures(Item.find({ approved: false }), req.query)
      .filter()
      .paginate()
      .sort()
      .limitFields();

    // Execute Query
    const items = await features.query;

    // calc noOfItems & send it to the client for pagination
    const noOfItems = await Item.countDocuments({ approved: false });

    // Send response (end req-res cycle)
    res.status(200).json({
      status: "Success",
      date: req.date,
      TotalItems: noOfItems, // for pagination
      results: items.length,
      data: {
        items: items,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.approveItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.itemId,
      { approved: true },
      { new: true, runValidators: true }
    );

    if (!item) return next(new ApiErrors(404, `Invalid ID !`));

    res.status(200).json({
      status: "Success",
      date: req.date,
      data: { item: item },
    });
  } catch (err) {
    next(err);
  }
};

// Search Feature - By Item Title
exports.searchByTitle = async (req, res, next) => {
  try {
    const searchTitle = req.params.searchTitle.replace(/  +/g, " ");

    // Build Query step by step ( 1.Filtering  2.Sorting  3.Field Limiting  4.Pagination )
    const features = new ApiFeatures(
      Item.find({
        approved: { $ne: false },
        $or: [
          { title: { $regex: searchTitle, $options: "i" } },
          { category: { $regex: searchTitle, $options: "i" } },
        ],
      }),
      req.query
    )
      .filter()
      .paginate()
      .sort()
      .limitFields();

    // Execute Query
    const items = await features.query;

    if (items.length === 0)
      return next(new ApiErrors(404, `Sorry Not Found Any Matches!`));

    // calc noOfItems & send it to the client for pagination
    const noOfItems = await Item.countDocuments({
      approved: { $ne: false },
      $or: [
        { title: { $regex: searchTitle, $options: "i" } },
        { category: { $regex: searchTitle, $options: "i" } },
      ],
    });

    // Send response (end req-res cycle)
    res.status(200).json({
      status: "Success",
      date: req.date,
      TotalItems: noOfItems, // for pagination
      results: items.length,
      data: {
        items: items,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Favorite Items - Feature
exports.updateFavItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item || !itemId) return next(new ApiErrors(404, `Invalid ID !`));

    // Check if the item is already in the favItems array or not
    let message = "";
    const currUser = await User.findById(req.currentUser._id);
    const favItems = currUser.favItems;
    const isItemInFavItems = favItems.includes(itemId);
    if (isItemInFavItems) {
      console.log("item is already in the favItems array");
      message = item.title + " - is Removed from your favorite items";
      await User.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $pull: { favItems: itemId } }
      );
    } else {
      message = item.title + " - is added to your favorite items";
      await User.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $push: { favItems: itemId } }
      );
    }

    const user = await User.findById(req.currentUser._id).populate({
      path: "favItems",
      select: "_id title price description category city -user",
    });

    res.status(201).json({
      status: message,
      date: req.date,
      results: user.favItems.length,
      favItems: user.favItems,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllFavItems = async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUser.id).populate({
      path: "favItems",
      select: "_id title price description category city -user coverImg imgs",
    });
    res.status(200).json({
      status: "success",
      date: req.date,
      favItems: user.favItems,
    });
  } catch (err) {
    next(err);
  }
};
