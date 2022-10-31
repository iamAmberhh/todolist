const loginAccount = document.getElementById("accountEmail");
const loginPwd = document.getElementById("login-password");
const loginBtn = document.querySelector(".login");
let token = "";
if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    if (loginAccount.value.trim() == "" || loginPwd.value.trim() == "") {
      Swal.fire("帳號密碼不可空白", "再次一次吧😚", "warning");
      return;
    }

    let obj = {};
    obj.email = loginAccount.value;
    obj.password = loginPwd.value;
    axios
      .post("https://todoo.5xcamp.us/users/sign_in", {
        user: obj,
      })
      .then((res) => {
        token = res.headers.authorization;
        localStorage.setItem("token", token);
        let loginUser = res.data.nickname;
        localStorage.setItem("username", loginUser);
        Swal.fire(`${res.data.message}`, `歡迎${loginUser}😚`, "success").then((result) => {
          if (result.isConfirmed) {
            window.location.assign("list.html");
          }
        })
       
      })
      .catch((err) => {
        Swal.fire(`${err.response.data.message}`, "再次一次吧😚", "warning");
        // alert(err.response.data.message);
      });
  });
}
