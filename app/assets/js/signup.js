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
      Swal.fire(
        '帳號密碼不可空白',
        "請輸入帳號密碼😚",
        'warning'
      )
      return;
    }
    if (pwd.value.length < 6) {
      Swal.fire(
        '密碼輸入錯誤',
        "密碼須超過6個字元😚",
        'warning'
      )
      return;
    }
    if (pwd.value !== pwdDoubleCheck.value) {
      Swal.fire(
        '兩次密碼不相符',
        "請再次確認😚",
        'warning'
      )
      return;
    }
    let obj = {};
    obj.email = accountInput.value;
    obj.nickname = nickname.value;
    obj.password = pwd.value;
    

    axios
      .post("https://todoo.5xcamp.us/users", {
        user: obj,
      })
      .then((res) => {
        Swal.fire(
          `${res.data.message}`,
          "😚",
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            window.location.assign("index.html");
          }
        })
      })
      .catch((err) => {
        Swal.fire(
          `${err.response.data.error}`,
          "再次一次吧😚",
          'warning'
        )
      });
  });
}
