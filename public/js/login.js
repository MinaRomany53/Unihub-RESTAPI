// const login = async (email, password) => {
//   try {
//     const res = await fetch(
//       "https://unihub.azurewebsites.net/api/v1/users/login",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       }
//     );
//     const data = await res.json();
//     console.log("data: ", data);
//     if (data.status === "Success") {
//       alert("Logged in successfully");
//       window.setTimeout(() => {
//         location.assign("/");
//       }, 1500);
//     }
//   } catch (err) {
//     console.log(err);
//     console.log("Invlid Username or Password");
//   }
// };
const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "https://unihub.azurewebsites.net/api/v1/users/login",
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    console.log(res);
  } catch (err) {
    console.log(err);
    console.log("Invlid Username or Password");
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  console.log("email: ", email);
  console.log("password: ", password);
  login(email, password);
});
