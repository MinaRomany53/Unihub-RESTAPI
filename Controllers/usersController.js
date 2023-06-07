const User = require("../Models/userModel");
const ApiFeatures = require("../Utils/apiFeatures");
const ApiErrors = require("../Utils/apiErrors");

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
    const bodyObj = filterBody(req.body, ["name", "email", "photo", "phone"]);

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
