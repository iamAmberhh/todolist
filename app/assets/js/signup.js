const accountInput = document.getElementById("signupEmail");
const nickname = document.getElementById("name");
const pwd = document.getElementById("password");
const pwdDoubleCheck = document.getElementById("passwordDoubleCheck");
const signUpBtn = document.querySelector(".sign-up");

if (signUpBtn) {
  signUpBtn.addEventListener("click", function (e) {
    if (
      accountInput.value.trim() == "" ||
      pwd.value.trim() == "" ||
      pwdDoubleCheck.value.trim() == ""
    ) {
      alert(`帳號密碼不可空白`);
      return;
    }
    if (pwd.value.length < 6) {
      alert(`密碼須超過6個字元`);
      return;
    }
    if (pwd.value !== pwdDoubleCheck.value) {
      alert(`密碼不相符，請再次確認`);
      return;
    }
    let obj = {};
    obj.email = accountInput.value;
    obj.nickname = nickname.value;
    obj.password = pwd.value;
    console.log(obj);

    axios
      .post("https://todoo.5xcamp.us/users", {
        user: obj,
      })
      .then((res) => {
        alert(res.data.message);
        window.location.assign("index.html");
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  });
}
