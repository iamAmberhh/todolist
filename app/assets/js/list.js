const list = document.querySelector(".list");
const inputBlock = document.querySelector(".input-block");
const inputText = document.querySelector(".input-text");
const enterBtn = document.querySelector(".enter-btn");
const nonList = document.querySelector(".none-list");
const listBlock = document.querySelector(".list-block");

//渲染畫面
let data = [];

function renderData(arr) {
  let str = "";
  arr.forEach((item) => {
    str += `<li class="d-flex border-bottom py-3" data-num="${item.num}">
    <label class="me-auto checkbox">
    <input class="form-check-input me-3" type="checkbox" ${item.check}>
    <span>${item.content}</span>
    </label>
    <a href="#" class="delete"><img src="assets/images/delete.jpg" alt="delete" class="img-fluid delete"></a>
</li>`;
  });
  nonList.setAttribute("class","d-none");
  listBlock.setAttribute("class","d-block");
  list.innerHTML = str;
  removeAll();
}

//新增代辦
enterBtn.addEventListener("click", addToDo);

function addToDo() {
  if (inputText.value === "") {
    alert(`請輸入代辦`);
    return;
  }
  let obj = {};
  obj.content = inputText.value;
  obj.check = "";
  obj.num = new Date().getTime();
  data.push(obj);
  inputText.value = "";
  updateList();
}
//按鈕輸入
inputBlock.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    addToDo();
  }
});

// 刪除代辦
list.addEventListener("click", function (e) {
  let ID = parseInt(e.target.closest("li").dataset.num);
  if (e.target.nodeName === "IMG") {
    e.preventDefault();
    let index = data.findIndex((item) => item.num === ID);
    data.splice(index, 1);
  } else if (e.target.nodeName === "INPUT") {
    data.forEach((i) => {
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
});

// 切換畫面

const tab = document.querySelector(".tab");
let tabStatus = "all";
tab.addEventListener("click", function (e) {
  tabStatus = e.target.dataset.status;
  let tabs = document.querySelectorAll(".tab li");
  tabs.forEach((i) => {
    i.classList.remove("tabs-active");
  });
  e.target.classList.add("tabs-active");
  updateList();
});

let undoNum = document.querySelector(".undo-num");

function updateList() {
  let showData = [];
  if (tabStatus === "all") {
    showData = data;
  } else if (tabStatus === "undo") {
    showData = data.filter((i) => i.check === "");
  } else if (tabStatus === "done") {
    showData = data.filter((i) => i.check === "checked");
  }

  let todoLength = data.filter((i) => i.check === "");
  let str = `${todoLength.length} 個待完成項目`;
  undoNum.innerHTML = str;

  renderData(showData);
}

// 清除完成項目
const clearAll = document.querySelector(".clear-all");
clearAll.addEventListener("click", function (e) {
  e.preventDefault();
  data = data.filter((i) => i.check === "");
  updateList();
});

function removeAll(){
  if(data.length === 0){
    listBlock.setAttribute("class","d-none");
    nonList.removeAttribute("class","d-none");
  }
}
