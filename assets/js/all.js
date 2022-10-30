"use strict";
"use strict";

var list = document.querySelector(".list");
var inputBlock = document.querySelector(".input-block");
var inputText = document.querySelector(".input-text");
var enterBtn = document.querySelector(".enter-btn");
var nonList = document.querySelector(".none-list");
var listBlock = document.querySelector(".list-block");
var data = [];

function getTodo() {
  axios.get("https://todoo.5xcamp.us/todos", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  }).then(function (res) {
    data = res.data.todos;
    updateList();
  })["catch"](function (err) {
    return alert(err.response);
  });
}

if (window.location.pathname == "/list.html") {
  getTodo();
} //渲染畫面


function renderData(arr) {
  var str = "";
  arr.forEach(function (item) {
    str += "<li class=\"d-flex border-bottom py-3\" data-id=\"".concat(item.id, "\">\n    <label class=\"me-auto checkbox\">\n    <input class=\"form-check-input me-3\" type=\"checkbox\">\n    <span>").concat(item.content, "</span>\n    </label>\n    <a href=\"#\" class=\"delete\"><img src=\"assets/images/delete.jpg\" alt=\"delete\" class=\"img-fluid delete\"></a>\n</li>");
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
    alert("\u8ACB\u8F38\u5165\u4EE3\u8FA6");
    return;
  }

  axios.post("https://todoo.5xcamp.us/todos", {
    todo: {
      content: inputText.value
    }
  }, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  }).then(function (res) {
    getTodo();
  })["catch"](function (err) {
    return console.log(err.response);
  });
  var obj = {};
  obj.content = inputText.value;
  obj.check = "";
  data.unshift(obj);
  inputText.value = "";
  updateList();
} //按鈕輸入


if (inputBlock) {
  inputBlock.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      addToDo();
    }
  });
} // 刪除代辦


if (list) {
  list.addEventListener("click", function (e) {
    var listId = e.target.closest("li").dataset.id;

    if (e.target.nodeName === "IMG") {
      e.preventDefault();
      axios["delete"]("https://todoo.5xcamp.us/todos/".concat(listId), {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(function (res) {
        alert(res.data.message);
      })["catch"](function (err) {
        return console.log(err.response);
      });
      var index = data.findIndex(function (item) {
        return item.id === listId;
      });
      data.splice(index, 1);
    } else {
      data.forEach(function (i) {
        var finish = "";

        if (i.id === listId) {
          axios.patch("https://todoo.5xcamp.us/todos/".concat(listId, "/toggle"), {}, {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then(function (res) {
            console.log(res.data);
          })["catch"](function (err) {
            return console.log(err.response);
          });
        }
      });
    }

    updateList();
  });
}

function check(obj) {
  if (obj.check == "") {
    obj.check = "checked";
  } else {
    obj.check = "";
  }
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
      return i.check === "";
    });
  } else if (tabStatus === "done") {
    showData = data.filter(function (i) {
      return i.check === "checked";
    });
  }

  var todoLength = data.filter(function (i) {
    return i.check === "";
  });
  var str = "".concat(todoLength.length, " \u500B\u5F85\u5B8C\u6210\u9805\u76EE");
  undoNum.innerHTML = str;
  renderData(showData);
} // 清除完成項目


var clearAll = document.querySelector(".clear-all");

if (clearAll) {
  clearAll.addEventListener("click", function (e) {
    e.preventDefault();
    data = data.filter(function (i) {
      return i.check === "";
    });
    updateList();
  });
}

function removeAll() {
  if (data.length === 0) {
    listBlock.setAttribute("class", "d-none");
    nonList.removeAttribute("class", "d-none");
  }
}
"use strict";

var loginAccount = document.getElementById("accountEmail");
var loginPwd = document.getElementById("login-password");
var loginBtn = document.querySelector(".login");
var token = "";

if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    if (loginAccount.value.trim() == "" || loginPwd.value.trim() == "") {
      alert("\u5E33\u865F\u5BC6\u78BC\u4E0D\u53EF\u7A7A\u767D");
      return;
    }

    var obj = {};
    obj.email = loginAccount.value;
    obj.password = loginPwd.value;
    axios.post("https://todoo.5xcamp.us/users/sign_in", {
      user: obj
    }).then(function (res) {
      alert(res.data.message);
      token = res.headers.authorization;
      localStorage.setItem('token', token);
      window.location.assign("list.html");
    })["catch"](function (err) {
      alert(err.response.data.message);
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
      alert("\u5E33\u865F\u5BC6\u78BC\u4E0D\u53EF\u7A7A\u767D");
      return;
    }

    if (pwd.value.length < 6) {
      alert("\u5BC6\u78BC\u9808\u8D85\u904E6\u500B\u5B57\u5143");
      return;
    }

    if (pwd.value !== pwdDoubleCheck.value) {
      alert("\u5BC6\u78BC\u4E0D\u76F8\u7B26\uFF0C\u8ACB\u518D\u6B21\u78BA\u8A8D");
      return;
    }

    var obj = {};
    obj.email = accountInput.value;
    obj.nickname = nickname.value;
    obj.password = pwd.value;
    console.log(obj);
    axios.post("https://todoo.5xcamp.us/users", {
      user: obj
    }).then(function (res) {
      alert(res.data.message);
      window.location.assign("index.html");
    })["catch"](function (err) {
      alert(err.response.data.error);
    });
  });
}
//# sourceMappingURL=all.js.map
