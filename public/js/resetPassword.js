const alertModel = document.getElementById("alert_modal");
const message = document.getElementById("message");

const hideAlert = () => {
  alertModel.classList.remove("show");
  alertModel.classList.add("hidden");
};

const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: "PATCH",
      //   url: `http://localhost:5000/api/v1/users/resetPassword/${token}`,
      url: `https://unihub.azurewebsites.net/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
      withCredentials: true,
    });
    // console.log(res);
    if (res.data.status === "Success") {
      alertModel.classList.remove("hidden");
      alertModel.classList.add("show");
      alertModel.classList.remove("fail");
      alertModel.classList.add("success");
      message.textContent = "Your Password Reset Successfully 🥳";
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
  const password = document.querySelector("#password").value;
  const passwordConfirm = document.querySelector("#confirmpassword").value;
  const token = document.querySelector(".form").getAttribute("data-token");

  if (!password || !passwordConfirm) {
    alertModel.classList.remove("hidden");
    alertModel.classList.add("show");
    alertModel.classList.remove("success");
    alertModel.classList.add("fail");
    message.textContent = "Please complete all the required fields 😘";
  } else {
    resetPassword(password, passwordConfirm, token);
  }
});
