const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      //   url: "http://localhost:5000/api/v1/users/login",
      url: "https://unihub.azurewebsites.net/api/v1/users/login",
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    console.log(res);
    if (res.data.status === "Success") {
      alert("Logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  if (!email || !password) return alert("Please enter email and password");
  else {
    login(email, password);
  }
});
