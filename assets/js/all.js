"use strict";
"use strict";

var list = document.querySelector(".list");
var inputBlock = document.querySelector(".input-block");
var inputText = document.querySelector(".input-text");
var enterBtn = document.querySelector(".enter-btn");
var nonList = document.querySelector(".none-list");
var listBlock = document.querySelector(".list-block"); //渲染畫面

var data = [];

function renderData(arr) {
  var str = "";
  arr.forEach(function (item) {
    str += "<li class=\"d-flex border-bottom py-3\" data-num=\"".concat(item.num, "\">\n    <label class=\"me-auto checkbox\">\n    <input class=\"form-check-input me-3\" type=\"checkbox\" ").concat(item.check, ">\n    <span>").concat(item.content, "</span>\n    </label>\n    <a href=\"#\" class=\"delete\"><img src=\"assets/images/delete.jpg\" alt=\"delete\" class=\"img-fluid delete\"></a>\n</li>");
  });
  nonList.setAttribute("class", "d-none");
  listBlock.setAttribute("class", "d-block");
  list.innerHTML = str;
  removeAll();
} //新增代辦


enterBtn.addEventListener("click", addToDo);

function addToDo() {
  if (inputText.value === "") {
    alert("\u8ACB\u8F38\u5165\u4EE3\u8FA6");
    return;
  }

  var obj = {};
  obj.content = inputText.value;
  obj.check = "";
  obj.num = new Date().getTime();
  data.push(obj);
  inputText.value = "";
  updateList();
} //按鈕輸入


inputBlock.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    addToDo();
  }
}); // 刪除代辦

list.addEventListener("click", function (e) {
  var ID = parseInt(e.target.closest("li").dataset.num);

  if (e.target.nodeName === "IMG") {
    e.preventDefault();
    var index = data.findIndex(function (item) {
      return item.num === ID;
    });
    data.splice(index, 1);
  } else if (e.target.nodeName === "INPUT") {
    data.forEach(function (i) {
      if (i.num === ID) {
        if (i.check === "") {
          i.check = "checked";
        } else {
          i.check = "";
        }
      }
    });
  }

  updateList();
}); // 切換畫面

var tab = document.querySelector(".tab");
var tabStatus = "all";
tab.addEventListener("click", function (e) {
  tabStatus = e.target.dataset.status;
  var tabs = document.querySelectorAll(".tab li");
  tabs.forEach(function (i) {
    i.classList.remove("tabs-active");
  });
  e.target.classList.add("tabs-active");
  updateList();
});
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
clearAll.addEventListener("click", function (e) {
  e.preventDefault();
  data = data.filter(function (i) {
    return i.check === "";
  });
  updateList();
});

function removeAll() {
  if (data.length === 0) {
    listBlock.setAttribute("class", "d-none");
    nonList.removeAttribute("class", "d-none");
  }
}
"use strict";

var accountInput = document.getElementById("signupEmail"); // const nickname = document.querySelector('')

console.log(accountInput);
console.log(123);
//# sourceMappingURL=all.js.map
