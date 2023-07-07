const alertModel = document.getElementById("alert_modal");
const message = document.getElementById("message");

const hideAlert = () => {
  alertModel.classList.remove("show");
  alertModel.classList.add("hidden");
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:5000/api/v1/users/login",
      //   url: "https://unihub.azurewebsites.net/api/v1/users/login",
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    // console.log(res);
    if (res.data.status === "Success") {
      alertModel.classList.remove("hidden");
      alertModel.classList.add("show");
      alertModel.classList.remove("fail");
      alertModel.classList.add("success");
      message.textContent = "Logged in successfully";
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    alertModel.classList.remove("hidden");
    alertModel.classList.add("show");
    alertModel.classList.remove("success");
    alertModel.classList.add("fail");
    message.textContent = err.response.data.message;
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  if (!email || !password) {
    alertModel.classList.remove("hidden");
    alertModel.classList.add("show");
    alertModel.classList.remove("success");
    alertModel.classList.add("fail");
    message.textContent = "Please provide email and password";
  } else {
    login(email, password);
  }
});
