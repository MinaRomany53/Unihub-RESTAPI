const Item = require("../Models/itemModel");
const User = require("../Models/userModel");
const ApiFeatures = require("../Utils/apiFeatures");
const ApiErrors = require("../Utils/apiErrors");

// ["Electronics", "Books", "Services", "Accessories", "Other"]

exports.getHomePage = async (req, res, next) => {
  const Books = await Item.find({
    category: "Books",
    approved: { $ne: false },
  }).limit(4);
  const Electronics = await Item.find({
    category: "Electronics",
    approved: { $ne: false },
  }).limit(4);
  const Services = await Item.find({
    category: "Services",
    approved: { $ne: false },
  }).limit(4);
  const Other = await Item.find({
    category: "Other",
    approved: { $ne: false },
  }).limit(4);
  const Accessories = await Item.find({
    category: "Accessories",
    approved: { $ne: false },
  }).limit(4);

  res.status(200).render("home", {
    Books: Books,
    Electronics: Electronics,
    Services: Services,
    Accessories: Accessories,
    Other: Other,
  });
};

exports.viewMoreItems = async (req, res, next) => {
  let items;
  if (req.params.category === "All_Classifieds") {
    items = await Item.find({ approved: { $ne: false } });
  } else {
    items = await Item.find({
      category: req.params.category,
      approved: { $ne: false },
    });
  }

  res.status(200).render("items", {
    items: items,
    heading: req.params.category,
  });
};

exports.viewSearchedItems = async (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const items = await Item.find({
    approved: { $ne: false },
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
    ],
  });

  // calc noOfItems & send it to the client for pagination
  // const noOfItems = await Item.countDocuments({
  //   approved: { $ne: false },
  //   $or: [
  //     { title: { $regex: searchTitle, $options: "i" } },
  //     { category: { $regex: searchTitle, $options: "i" } },
  //   ],
  // });

  // TotalItems: noOfItems, // for pagination

  res.status(200).render("items", {
    items: items,
    heading: searchTerm,
  });
};
