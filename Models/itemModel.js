const mongoose = require("mongoose");
const User = require("./userModel");

// Create Item Schema
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "must have a title"],
    trim: true,
    minLength: [8, "Minimum title length is 8 characters"],
    maxLength: [40, "Maximum title length is 40 characters"],
  },
  price: { type: Number, required: [true, "must have a price"] },
  description: {
    type: String,
    required: [true, "must have a description"],
    trim: true,
  },
  coverImg: {
    type: String,
    default: "default.jpg",
  },
  imgs: {
    type: [String],
    default: ["default.jpg", "default.jpg"],
  },
  category: {
    type: String,
    required: [true, "You must choose one category"],
    enum: {
      values: [
        "Electronics",
        "Books",
        "Services",
        "Accessories",
        "Tools",
        "Other",
      ],
      message:
        "{VALUE} is not supported, You must choose category field from: Electronics - Books - Services - Accessories - Other",
    },
  },
  city: { type: String, required: true, trim: true },
  createAt: { type: Date, default: Date.now },
  closed: { type: Boolean, default: false },
  condition: {
    type: String,
    required: [true, "Condition is required"],
    enum: {
      values: ["New", "Used", "Other"],
      message:
        "{VALUE} is not supported, You must choose Condition field from: New - Used - Other",
    },
  },
  // Embedded Document
  location: {
    //GeoJSON
    geoType: {
      type: String,
      default: "point",
      enum: ["point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  //Approved Item  => Admin
  approved: { type: Boolean, default: false },
  // Parent Referencing - user
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
});

// MongoDB Indexes  -  execute query with Price faster
itemSchema.index({ price: 1 });

/* ------------------- Start Mongoose Middleware ------------------- */

// Document Middleware  -  runs before create() and save()
itemSchema.pre("save", async function (next) {
  this.title = this.title.replace(/  +/g, " ");
  this.populate({
    path: "user",
    select: "-__v -passwordChangeAt -password -items -role",
  }); // populate user field with all fields except __v, passwordChangedAt, password
  next();
});

// Query Middleware  - runs before find()
itemSchema.pre(/^find/, function (next) {
  this.find({ closed: { $ne: true } }); // not showing any Closed Item
  this.populate({
    path: "user",
    select: "-__v -passwordChangeAt -password -items -role",
  }); // populate user field with all fields except __v, passwordChangedAt, password
  next();
});

// Aggregation Middleware  - runs before aggregate() only
itemSchema.pre("aggregate", function (next) {
  const stage = { $match: { closed: { $ne: true }, approved: { $ne: false } } };
  this.pipeline().unshift(stage); // add new stage at the first of aggregation pipeline array
  next();
});

/* ------------------- End Mongoose Middleware --------------------- */

// Create Item Model
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
