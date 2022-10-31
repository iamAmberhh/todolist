"use strict";
"use strict";

var list = document.querySelector(".list");
var inputBlock = document.querySelector(".input-block");
var inputText = document.querySelector(".input-text");
var enterBtn = document.querySelector(".enter-btn");
var nonList = document.querySelector(".none-list");
var listBlock = document.querySelector(".list-block");
var username = document.querySelector('.username');
var data = [];

function getTodo() {
  axios.get("https://todoo.5xcamp.us/todos", {
    headers: {
      Authorization: localStorage.token
    }
  }).then(function (res) {
    data = res.data.todos;
    updateList();
  })["catch"](function (err) {
    return Swal.fire("".concat(err.response), "出現了一些錯誤", "warning");
  });
}

if (window.location.pathname == "/list.html") {
  getTodo();
  username.textContent = "".concat(localStorage.username, "\u7684\u4EE3\u8FA6");
} //渲染畫面


function renderData(arr) {
  var str = "";
  arr.forEach(function (item) {
    str += "<li class=\"d-flex border-bottom py-3\" data-id=\"".concat(item.id, "\">\n    <label class=\"me-auto checkbox\">\n    <input class=\"form-check-input me-3\" type=\"checkbox\" ").concat(item.completed_at === null ? "" : "checked", ">\n    <span>").concat(item.content, "</span>\n    </label>\n    <a href=\"#\" class=\"delete\"><img src=\"assets/images/delete.jpg\" alt=\"delete\" class=\"img-fluid delete\"></a>\n</li>");
  });
  nonList.setAttribute("class", "d-none");
  listBlock.setAttribute("class", "d-block");
  list.innerHTML = str;
  removeAll();
} //新增代辦


if (enterBtn) {
  enterBtn.addEventListener("click", addToDo);
}

function addToDo() {
  if (inputText.value === "") {
    Swal.fire("\u8ACB\u8F38\u5165\u4EE3\u8FA6", "代辦空空是不行的", "warning");
    return;
  }

  axios.post("https://todoo.5xcamp.us/todos", {
    todo: {
      content: inputText.value
    }
  }, {
    headers: {
      Authorization: localStorage.token
    }
  }).then(function (res) {
    getTodo();
    var obj = {};
    obj.content = inputText.value;
    obj.check = "";
    data.unshift(obj);
    inputText.value = "";
    updateList();
  })["catch"](function (err) {
    return console.log(err.response);
  });
} //按鈕輸入


if (inputBlock) {
  inputBlock.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      addToDo();
    }
  });
} // 刪除&完成代辦


if (list) {
  list.addEventListener("click", function (e) {
    var listId = e.target.closest("li").dataset.id;
    var checkBtn = e.target.closest("input");

    if (e.target.nodeName === "IMG") {
      e.preventDefault();
      axios["delete"]("https://todoo.5xcamp.us/todos/".concat(listId), {
        headers: {
          Authorization: localStorage.token
        }
      }).then(function (res) {
        Swal.fire("".concat(res.data.message), "太棒啦", "success");
      })["catch"](function (err) {
        return console.log(err.response);
      });
      var index = data.findIndex(function (item) {
        return item.id === listId;
      });
      data.splice(index, 1);
      updateList();
    } else {
      data.forEach(function (i) {
        if (i.id === listId) {
          axios.patch("https://todoo.5xcamp.us/todos/".concat(listId, "/toggle"), {}, {
            headers: {
              Authorization: localStorage.token
            }
          }).then(function (res) {
            data.forEach(function (item, index) {
              if (item.id === res.data.id) {
                data[index].completed_at = res.data.completed_at;
              }
            });
            updateList();
          })["catch"](function (err) {
            return console.log(err);
          });
        }
      });
    }
  });
} // 切換畫面


var tab = document.querySelector(".tab");
var tabStatus = "all";

if (tab) {
  tab.addEventListener("click", function (e) {
    tabStatus = e.target.dataset.status;
    var tabs = document.querySelectorAll(".tab li");
    tabs.forEach(function (i) {
      i.classList.remove("tabs-active");
    });
    e.target.classList.add("tabs-active");
    updateList();
  });
}

var undoNum = document.querySelector(".undo-num");

function updateList() {
  var showData = [];

  if (tabStatus === "all") {
    showData = data;
  } else if (tabStatus === "undo") {
    showData = data.filter(function (i) {
      return i.completed_at === null;
    });
  } else if (tabStatus === "done") {
    showData = data.filter(function (i) {
      return i.completed_at !== null;
    });
  }

  var todoLength = data.filter(function (i) {
    return i.completed_at === null;
  });
  var str = "".concat(todoLength.length, " \u500B\u5F85\u5B8C\u6210\u9805\u76EE");
  undoNum.innerHTML = str;
  renderData(showData);
} // 清除完成項目


var clearAll = document.querySelector(".clear-all");

if (clearAll) {
  clearAll.addEventListener("click", function (e) {
    e.preventDefault();
    var deleteData = data.filter(function (i) {
      return i.completed_at !== null;
    });
    deleteData.forEach(function (i) {
      axios["delete"]("https://todoo.5xcamp.us/todos/".concat(i.id), {
        headers: {
          Authorization: localStorage.token
        }
      }).then(function (res) {
        Swal.fire("\u5DF2\u6E05\u9664\u4EE3\u8FA6", "恭喜完成啦", "success");
      })["catch"](function (err) {
        return console.log(err.response);
      });
    });
    data = data.filter(function (i) {
      return i.completed_at === null;
    });
    updateList();
  });
}

function removeAll() {
  if (data.length === 0) {
    listBlock.setAttribute("class", "d-none");
    nonList.removeAttribute("class", "d-none");
  }
} // 登出


var logoutBtn = document.querySelector('.logoutBtn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    axios["delete"]("https://todoo.5xcamp.us/users/sign_out", {
      headers: {
        Authorization: localStorage.token
      }
    }).then(function (res) {
      Swal.fire("".concat(res.data.message), "明天見😚", "success").then(function (result) {
        if (result.isConfirmed) {
          window.location.assign("index.html");
        }
      });
    })["catch"](function (err) {
      return console.log(err.response);
    });
  });
}
"use strict";

var loginAccount = document.getElementById("accountEmail");
var loginPwd = document.getElementById("login-password");
var loginBtn = document.querySelector(".login");
var token = "";

if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    if (loginAccount.value.trim() == "" || loginPwd.value.trim() == "") {
      Swal.fire("帳號密碼不可空白", "再次一次吧😚", "warning");
      return;
    }

    var obj = {};
    obj.email = loginAccount.value;
    obj.password = loginPwd.value;
    axios.post("https://todoo.5xcamp.us/users/sign_in", {
      user: obj
    }).then(function (res) {
      token = res.headers.authorization;
      localStorage.setItem("token", token);
      var loginUser = res.data.nickname;
      localStorage.setItem("username", loginUser);
      Swal.fire("".concat(res.data.message), "\u6B61\u8FCE".concat(loginUser, "\uD83D\uDE1A"), "success").then(function (result) {
        if (result.isConfirmed) {
          window.location.assign("list.html");
        }
      });
    })["catch"](function (err) {
      Swal.fire("".concat(err.response.data.message), "再次一次吧😚", "warning"); // alert(err.response.data.message);
    });
  });
}
"use strict";

var accountInput = document.getElementById("signupEmail");
var nickname = document.getElementById("name");
var pwd = document.getElementById("password");
var pwdDoubleCheck = document.getElementById("passwordDoubleCheck");
var signUpBtn = document.querySelector(".sign-up");

if (signUpBtn) {
  signUpBtn.addEventListener("click", function (e) {
    if (accountInput.value.trim() == "" || pwd.value.trim() == "" || pwdDoubleCheck.value.trim() == "") {
      Swal.fire('帳號密碼不可空白', "請輸入帳號密碼😚", 'warning');
      return;
    }

    if (pwd.value.length < 6) {
      Swal.fire('密碼輸入錯誤', "密碼須超過6個字元😚", 'warning');
      return;
    }

    if (pwd.value !== pwdDoubleCheck.value) {
      Swal.fire('兩次密碼不相符', "請再次確認😚", 'warning');
      return;
    }

    var obj = {};
    obj.email = accountInput.value;
    obj.nickname = nickname.value;
    obj.password = pwd.value;
    axios.post("https://todoo.5xcamp.us/users", {
      user: obj
    }).then(function (res) {
      Swal.fire("".concat(res.data.message), "😚", 'success').then(function (result) {
        if (result.isConfirmed) {
          window.location.assign("index.html");
        }
      });
    })["catch"](function (err) {
      Swal.fire("".concat(err.response.data.error), "再次一次吧😚", 'warning');
    });
  });
}
//# sourceMappingURL=all.js.map
