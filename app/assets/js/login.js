const loginAccount = document.getElementById("accountEmail");
const loginPwd = document.getElementById("login-password");
const loginBtn = document.querySelector(".login");
let token = "";
if(loginBtn){
  loginBtn.addEventListener("click", function (e) {
    if (loginAccount.value.trim() == "" || loginPwd.value.trim() == "") {
      alert(`帳號密碼不可空白`);
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
        alert(res.data.message);
        token = res.headers.authorization
        localStorage.setItem('token', token)
        window.location.assign("list.html");
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  });
}
