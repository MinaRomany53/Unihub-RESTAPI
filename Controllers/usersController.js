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

exports.uploadPhoto = upload.single("photo");
// End Multer Config midddlware

// Start Sharp Config midddlware for resize image
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.currentUser.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/users/${req.file.filename}`);

  next();
};
// End Sharp Config midddlware for resize image

const filterBody = (obj, allowedInfo) => {
  const newObj = {};
  allowedInfo.forEach((el) => {
    if (obj[el]) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUser.id);

    res.status(200).json({
      status: "success",
      date: req.date,
      data: { user: user },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // Create Error if user try to update Password
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new ApiErrors(
          400,
          "Update Password is Not Allowed in this Route!, Please Update your Password from here /updatePassword"
        )
      );

    // Restrict Updated Fields -not update everything user send
    const bodyObj = filterBody(req.body, ["name", "email", "phone"]);
    if (req.file) bodyObj.photo = req.file.filename;

    //Update User Info
    const updatedUser = await User.findByIdAndUpdate(
      req.currentUser.id,
      bodyObj,
      {
        new: true,
        runValidators: true,
      }
    );

    // Send Response
    res.status(200).json({
      status: "success",
      date: req.date,
      message: "Your Information Updated Successfully",
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    // Convert User Active Field To false
    await User.findByIdAndUpdate(req.currentUser.id, { active: false });
    // Send Response
    res.status(204).json({
      status: "success",
      date: req.date,
      message: "This Account Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const features = new ApiFeatures(User.find(), req.query)
      .filter()
      .paginate()
      .sort()
      .limitFields();

    const users = await features.query.select("-password");

    res.status(200).json({
      status: "Success",
      date: req.date,
      results: users.length,
      data: { users: users },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new ApiErrors(404, "Invalid Id ❌"));

    res.status(200).json({
      status: "Success",
      date: req.date,
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return next(new ApiErrors(404, "Invalid Id ❌"));

    res.status(200).json({
      status: "Success",
      date: req.date,
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return next(new ApiErrors(404, "Invalid Id ❌"));

    res.status(204).json({
      status: "Success",
      date: req.date,
      user: null,
    });
  } catch (err) {
    next(err);
  }
};
