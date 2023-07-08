const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:5000/api/v1/users/logout",
      // url: "https://unihub.azurewebsites.net/api/v1/users/logout",
      withCredentials: true,
    });
    if (res.data.status === "Success") location.reload(true);
  } catch (err) {
    alert("Error logging out! Try again.");
  }
};

if (document.querySelector(".account__image")) {
  document.querySelector(".account__image").addEventListener("click", (e) => {
    const accountMenu = document.querySelector(".account__menu");
    accountMenu.classList.toggle("account__menu-hidden");
    accountMenu.classList.toggle("account__menu-show");
  });
  document.querySelector(".logout").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}
