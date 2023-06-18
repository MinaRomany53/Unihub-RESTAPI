exports.getHomePage = (req, res, next) => {
  res.status(200).render("home", {
    title: "Welcome To Home Page",
  });
};
