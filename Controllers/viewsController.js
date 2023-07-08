const Item = require("../Models/itemModel");
const User = require("../Models/userModel");
const ApiFeatures = require("../Utils/apiFeatures");
const ApiErrors = require("../Utils/apiErrors");

// ["Electronics", "Books", "Tools" , "Services", "Accessories", "Other"]

function convertObjectToUrlParams(paramsObj) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(paramsObj)) {
    if (key === "page") continue;
    params.append(key, value);
  }

  return params.toString();
}

exports.getHomePage = async (req, res, next) => {
  try {
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
    const Tools = await Item.find({
      category: "Tools",
      approved: { $ne: false },
    }).limit(4);

    res.status(200).render("home", {
      Books: Books,
      Electronics: Electronics,
      Services: Services,
      Tools: Tools,
      Accessories: Accessories,
      Other: Other,
    });
  } catch (err) {
    next(err);
  }
};

exports.viewSearchedItems = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || "";

    const features = new ApiFeatures(
      Item.find({
        approved: { $ne: false },
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
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

    let heading = "";
    if (searchTerm === "") {
      heading = req.query.category || "All Classifieds";
    } else {
      heading = searchTerm;
    }

    // calc noOfItems & send it to the client for pagination
    const allItems = new ApiFeatures(
      Item.find({
        approved: { $ne: false },
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
        ],
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields();

    // Execute Query
    let noItems = await allItems.query;
    noItems = noItems.length;

    const totalPages = Math.ceil(noItems / 10);

    const currentPage = req.query.page * 1 || 1;

    const urlParams = convertObjectToUrlParams(req.query);

    res.status(200).render("items", {
      items: items,
      heading: heading,
      totalPages: totalPages,
      currentPage: currentPage,
      urlParams: urlParams,
    });
  } catch (err) {
    next(err);
  }
};

exports.getItemPage = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) return next(new ApiErrors(404, `Sorry, This Item Not Found`));

    const relatedItems = await Item.find({
      category: item.category,
      _id: { $ne: item._id },
      approved: { $ne: false },
    }).limit(3);

    res.status(200).render("item", {
      item: item,
      relatedItems: relatedItems,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLoginPage = (req, res, next) => {
  res.status(200).render("login");
};

exports.getSignupPage = (req, res, next) => {
  res.status(200).render("signup");
};

exports.getProfilePage = async (req, res, next) => {
  try {
    const profile = await User.findById(req.params.userId).populate({
      path: "favItems",
      select:
        "_id title price description category city -user coverImg imgs createAt",
    });

    if (!profile) return next(new ApiErrors(404, `Sorry, This User Not Found`));

    const approvedItems = profile.items.filter(
      (item) => item.approved === true
    );

    const notApprovedItems = profile.items.filter(
      (item) => item.approved === false
    );

    const favItems = profile.favItems;

    if (req.currentUser) {
      if (req.currentUser._id.toString() === profile._id.toString()) {
        return res.status(200).render("myProfile", {
          profile: profile,
          approvedItems: approvedItems,
          notApprovedItems: notApprovedItems,
          favItems: favItems,
        });
      }
    }

    res.status(200).render("profile", {
      profile: profile,
      approvedItems: approvedItems,
    });
  } catch (err) {
    next(err);
  }
};
