const list = document.querySelector(".list");
const inputBlock = document.querySelector(".input-block");
const inputText = document.querySelector(".input-text");
const enterBtn = document.querySelector(".enter-btn");
const nonList = document.querySelector(".none-list");
const listBlock = document.querySelector(".list-block");

let data = [];

function getTodo() {
  axios
    .get("https://todoo.5xcamp.us/todos", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      data = res.data.todos;
      updateList();
    })
    .catch((err) => alert(err.response));
}

if(window.location.pathname == "/list.html"){
  getTodo();
}

//渲染畫面

function renderData(arr) {
  let str = "";
  arr.forEach((item) => {
    str += `<li class="d-flex border-bottom py-3" data-id="${item.id}">
    <label class="me-auto checkbox">
    <input class="form-check-input me-3" type="checkbox">
    <span>${item.content}</span>
    </label>
    <a href="#" class="delete"><img src="assets/images/delete.jpg" alt="delete" class="img-fluid delete"></a>
</li>`;
  });
  nonList.setAttribute("class", "d-none");
  listBlock.setAttribute("class", "d-block");
  list.innerHTML = str;
  removeAll();
}

//新增代辦
if (enterBtn) {
  enterBtn.addEventListener("click", addToDo);
}

function addToDo() {
  if (inputText.value === "") {
    alert(`請輸入代辦`);
    return;
  }

  axios
    .post(
      "https://todoo.5xcamp.us/todos",
      {
        todo: {
          content: inputText.value,
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    )
    .then((res) => {
      getTodo();
    })
    .catch((err) => console.log(err.response));

  let obj = {};
  obj.content = inputText.value;
  obj.check = "";
  data.unshift(obj);
  inputText.value = "";
  updateList();
}
//按鈕輸入
if (inputBlock) {
  inputBlock.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      addToDo();
    }
  });
}


// 刪除代辦
if (list) {
  list.addEventListener("click", function (e) {
    let listId = e.target.closest("li").dataset.id;
    if (e.target.nodeName === "IMG") {
      e.preventDefault();

      axios
        .delete(`https://todoo.5xcamp.us/todos/${listId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => console.log(err.response));

      let index = data.findIndex((item) => item.id === listId);
      data.splice(index, 1);
    } else {
      data.forEach((i) => {
        let finish = "";
        if (i.id === listId) {
          axios
            .patch(
              `https://todoo.5xcamp.us/todos/${listId}/toggle`,
              {},
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            )
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => console.log(err.response));
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
}

// 切換畫面

const tab = document.querySelector(".tab");
let tabStatus = "all";
if (tab) {
  tab.addEventListener("click", function (e) {
    tabStatus = e.target.dataset.status;
    let tabs = document.querySelectorAll(".tab li");
    tabs.forEach((i) => {
      i.classList.remove("tabs-active");
    });
    e.target.classList.add("tabs-active");
    updateList();
  });
}

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
if (clearAll) {
  clearAll.addEventListener("click", function (e) {
    e.preventDefault();
    data = data.filter((i) => i.check === "");
    updateList();
  });
}

function removeAll() {
  if (data.length === 0) {
    listBlock.setAttribute("class", "d-none");
    nonList.removeAttribute("class", "d-none");
  }
}
