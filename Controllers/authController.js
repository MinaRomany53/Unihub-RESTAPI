const User = require("../Models/userModel");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiErrors = require("../Utils/apiErrors");
const { promisify } = require("util");
const sendEmail = require("../Utils/email");

exports.signup = async (req, res, next) => {
  try {
    // Create New User in Database - only tihs fields is allowed to recieved from user in the body
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
      photo: req.body.photo,
    });
    newUser.password = undefined; // not showing it in the respons00e
    newUser.active = undefined;
    newUser.role = undefined;
    newUser.__v = undefined;
    newUser.joinAt = undefined;

    // Create new unique JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send Welcome Email
    const options = {
      email: newUser.email,
      subject: "Welcome To UniHub",
      message: `Welcome to UniHub ,feel free to contact us at any time\n Best Regards\n CEO: Mina Romany
          `,
    };
    await sendEmail(options);

    // Send JWT with Cookie to the Browser
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "Production") cookieOptions.secure = true; // https only in production

    res.cookie("jwt", token, cookieOptions);

    // Send Response
    res.status(201).json({
      status: "Success",
      date: req.date,
      token: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Check User Credentials First
    const { email, password } = req.body;

    if (!password || !email)
      return next(new ApiErrors(400, "Email and Password Required!"));

    const account = await User.findOne({ email: email }).select("+password");
    if (!account) return next(new ApiErrors(401, "Sorry ,user not found!"));

    const checkPassword = await bcrypt.compare(password, account.password);
    if (!checkPassword)
      return next(new ApiErrors(401, "Sorry ,email or password is incorrect!"));

    // Congratulations now we can Create new unique JWT as a passport to this user
    const token = jwt.sign({ id: account._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send JWT with Cookie to the Browser
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "Production") cookieOptions.secure = true; // https only in production

    res.cookie("jwt", token, cookieOptions);

    // return Logged User Info Without the Password
    account.password = undefined;
    account.active = undefined;
    account.role = undefined;
    account.__v = undefined;
    account.joinAt = undefined;

    // Send Response
    res.status(200).json({
      status: "Success",
      date: req.date,
      token: token,
      data: {
        account: account,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Check if Token exist first
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return next(new ApiErrors(401, "Please Login First!"));

    // Verify this Token
    const decodeToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_PRIVATE_KEY
    );

    // Check if user still exist
    const currentUser = await User.findById(decodeToken.id);
    if (!currentUser)
      return next(new ApiErrors(401, "This User no longer exist!"));

    // Check if user change password after sending this Token
    if (currentUser.passwordChangeAt) {
      const tokenIssuedAt = decodeToken.iat; // seconds
      const passChangedAt = currentUser.passwordChangeAt.getTime() / 1000; // seconds
      if (tokenIssuedAt < passChangedAt) {
        return next(
          new ApiErrors(
            401,
            "This User change his Password, Please Login Again!"
          )
        );
      }
    }

    // Move to next middleware to get the protected route
    req.currentUser = currentUser; // use it to access Role of current user - next middleware
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      err.message = "Invalid Token, Please Login Again!";
    if (err.name === "TokenExpiredError")
      err.message = "Your Token Expired, Please Login Again!";
    err.statusCode = 401;
    next(err);
  }
};

exports.restrictTo = function (...roles) {
  // return middleware function
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role))
      return next(
        new ApiErrors(
          403,
          "Sorry,You don't havne permission to perform this Action!"
        )
      );
    next();
  };
};

exports.forgetPassword = async (req, res, next) => {
  try {
    // Cehck that Email
    if (!req.body.email)
      return next(new ApiErrors(400, "Please Enter Valid Email!"));
    // Check if user exist with this email
    const account = await User.findOne({ email: req.body.email });
    if (!account)
      return next(
        new ApiErrors(404, "There is no user with this email address!")
      );
    // Create random JWT
    const token = jwt.sign(
      { email: account.email },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "20minute",
      }
    );

    // Send it to user's email to reset password
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${token}`; //http://localhost:8000/api/v1/users/resetPassword/token
    const options = {
      email: account.email,
      subject: "Reset Your Password - (Only Valid For 20 Minutes)",
      message: `Hello from UniHub - Please Reset Your Password by PATCH request with your new password and passwordConfirm to: ${resetURL}`,
    };
    await sendEmail(options);

    // Send response
    res.status(200).json({
      status: "success",
      message: "E-mail Sent Successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const urlToken = req.params.token;
    // Verify this Token
    const decodeToken = await promisify(jwt.verify)(
      urlToken,
      process.env.JWT_PRIVATE_KEY
    );

    // Get User form this token
    const account = await User.findOne({ email: decodeToken.email });
    if (!account) return next(new ApiErrors(404, "Token is Invalid!"));

    // Change User Password and PasswordChangeAt property
    account.password = req.body.password;
    account.passwordConfirm = req.body.passwordConfirm;
    account.passwordChangeAt = new Date() - 1000;
    await account.save(); // to run all validators and document middleware function

    // Log In The User
    const token = jwt.sign({ id: account._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // return Logged User Info Without the Password
    account.password = undefined;
    account.active = undefined;
    account.role = undefined;
    account.__v = undefined;
    account.joinAt = undefined;

    // Send JWT with Cookie to the Browser
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "Production") cookieOptions.secure = true; // https only in production

    res.cookie("jwt", token, cookieOptions);

    // Send Response
    res.status(200).json({
      status: "success",
      date: req.date,
      message: "Your Password Changed Successfully",
      token: token,
      data: {
        account: account,
      },
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      err.message = "Invalid Token, Please Try Again!";
    if (err.name === "TokenExpiredError")
      err.message = "Your Token Expired, Please Try Again!";
    err.statusCode = 401;
    next(err);
  }
};

exports.updatMyPassword = async (req, res, next) => {
  try {
    // Get User
    const user = await User.findById(req.currentUser.id).select("+password");
    // Check User Password
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) return next(new ApiErrors(401, "Password is not Correct!"));
    // Update User Password to the new Password and specify PasswordChangeAt property
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    user.passwordChangeAt = new Date() - 1000;
    await user.save(); // to run all validators and document middleware function
    // Log User in  - send JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Send JWT with Cookie to the Browser
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "Production") cookieOptions.secure = true; // https only in production

    res.cookie("jwt", token, cookieOptions);

    // Send Response
    res.status(200).json({
      status: "success",
      date: req.date,
      message: "Your Password Updated Successfully",
      token: token,
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError")
      err.message = "Invalid Token, Please Try Again!";
    if (err.name === "TokenExpiredError")
      err.message = "Your Token Expired, Please Try Again!";
    err.statusCode = 401;
    next(err);
  }
};

// server side rendering
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt === "loggedout") return next();
  // Check if Token exist in the cookies first
  if (req.cookies.jwt) {
    // Verify this Token
    const decodeToken = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_PRIVATE_KEY
    );
    // Check if user still exist
    const currentUser = await User.findById(decodeToken.id);
    if (!currentUser) return next();
    // Check if user change password after sending this Token
    if (currentUser.passwordChangeAt) {
      const tokenIssuedAt = decodeToken.iat; // seconds
      const passChangedAt = currentUser.passwordChangeAt.getTime() / 1000; // seconds
      if (tokenIssuedAt < passChangedAt) {
        return next();
      }
    }
    // Move to next middleware there is a user LoggedIn
    res.locals.user = currentUser; // use it to access current user data in the pug template

    return next();
  }
  next();
};

exports.logout = async (req, res, next) => {
  try {
    // Send JWT with Cookie to the Browser
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "Production") cookieOptions.secure = true; // https only in production

    res.cookie("jwt", "loggedout", cookieOptions);

    // Send Response
    res.status(200).json({
      status: "Success",
      date: req.date,
      message: "Logged Out Successfully",
    });
  } catch (err) {
    next(err);
  }
};
