const alertModel = document.getElementById("alert_modal");
const message = document.getElementById("message");

const hideAlert = () => {
  alertModel.classList.remove("show");
  alertModel.classList.add("hidden");
};

const signup = async (email, password, name, phone, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      //   url: "http://localhost:5000/api/v1/users/signup",
      url: "https://unihub.azurewebsites.net/api/v1/users/signup",
      data: {
        name,
        phone,
        email,
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
      message.textContent = "Account Created Successfully 🥳";
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
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
  const password = document.querySelector("#password").value;
  const passwordConfirm = document.querySelector("#confirmpassword").value;

  if (!email || !password || !name || !phone || !passwordConfirm) {
    alertModel.classList.remove("hidden");
    alertModel.classList.add("show");
    alertModel.classList.remove("success");
    alertModel.classList.add("fail");
    message.textContent = "Please complete all the required fields 😘";
  } else {
    signup(email, password, name, phone, passwordConfirm);
  }
});
