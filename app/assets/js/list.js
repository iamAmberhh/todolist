const list = document.querySelector(".list");
const inputBlock = document.querySelector(".input-block");
const inputText = document.querySelector(".input-text");
const enterBtn = document.querySelector(".enter-btn");
const nonList = document.querySelector(".none-list");
const listBlock = document.querySelector(".list-block");
const username = document.querySelector('.username');


let data = [];


function getTodo() {
  axios
    .get("https://todoo.5xcamp.us/todos", {
      headers: {
        Authorization: localStorage.token,
      },
    })
    .then((res) => {
      data = res.data.todos;
      updateList();
    })
    .catch((err) => 
    Swal.fire(
      `${err.response}`,
       "出現了一些錯誤", 
       "warning"
       )
    );
}

if (window.location.pathname == "/list.html") {
  getTodo();
  username.textContent = `${localStorage.username}的代辦`;
}

//渲染畫面
function renderData(arr) {
  let str = "";
  arr.forEach((item) => {
    str += `<li class="d-flex border-bottom py-3" data-id="${item.id}">
    <label class="me-auto checkbox">
    <input class="form-check-input me-3" type="checkbox" ${
      item.completed_at === null ? "" : "checked"
    }>
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
    Swal.fire(
      `請輸入代辦`,
       "代辦空空是不行的", 
       "warning"
       )
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
          Authorization: localStorage.token,
        },
      }
    )
    .then((res) => {
      getTodo();
      let obj = {};
      obj.content = inputText.value;
      obj.check = "";
      data.unshift(obj);
      inputText.value = "";
      updateList();
    })
    .catch((err) => console.log(err.response));
}

//按鈕輸入
if (inputBlock) {
  inputBlock.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      addToDo();
    }
  });
}

// 刪除&完成代辦
if (list) {
  list.addEventListener("click", function (e) {
    let listId = e.target.closest("li").dataset.id;
    let checkBtn = e.target.closest("input");
    if (e.target.nodeName === "IMG") {
      e.preventDefault();

      axios
        .delete(`https://todoo.5xcamp.us/todos/${listId}`, {
          headers: {
            Authorization: localStorage.token,
          },
        })
        .then((res) => {
          Swal.fire(
            `${res.data.message}`,
             "太棒啦", 
             "success"
             )
        })
        .catch((err) => console.log(err.response));

      let index = data.findIndex((item) => item.id === listId);
      data.splice(index, 1);
      updateList();
    } else {
      data.forEach((i) => {
        if (i.id === listId) {
          axios
            .patch(
              `https://todoo.5xcamp.us/todos/${listId}/toggle`,
              {},
              {
                headers: {
                  Authorization: localStorage.token,
                },
              }
            )
            .then((res) => {
              data.forEach((item, index) => {
                if (item.id === res.data.id) {
                  data[index].completed_at = res.data.completed_at;
                }
              });
              updateList();
            })
            .catch((err) => console.log(err));
        }
      });
    }
  });
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
    showData = data.filter((i) => i.completed_at === null);
  } else if (tabStatus === "done") {
    showData = data.filter((i) => i.completed_at !== null);
  }

  let todoLength = data.filter((i) => i.completed_at === null);
  let str = `${todoLength.length} 個待完成項目`;
  undoNum.innerHTML = str;

  renderData(showData);
}

// 清除完成項目
const clearAll = document.querySelector(".clear-all");
if (clearAll) {
  clearAll.addEventListener("click", function (e) {
    e.preventDefault();
    let deleteData = data.filter(i=> i.completed_at !== null);
    deleteData.forEach(i=>{
      axios
        .delete(`https://todoo.5xcamp.us/todos/${i.id}`, {
          headers: {
            Authorization: localStorage.token,
          },
        })
        .then((res) => {
          Swal.fire(
            `已清除代辦`,
             "恭喜完成啦", 
             "success"
             )
        })
        .catch((err) => console.log(err.response));
    })

    

    data = data.filter((i) => i.completed_at === null);
    updateList();
  });
}

function removeAll() {
  if (data.length === 0) {
    listBlock.setAttribute("class", "d-none");
    nonList.removeAttribute("class", "d-none");
  }
}



// 登出

const logoutBtn = document.querySelector('.logoutBtn');
if(logoutBtn){
  logoutBtn.addEventListener('click',function(e){
    e.preventDefault();
    axios
          .delete("https://todoo.5xcamp.us/users/sign_out", {
            headers: {
              Authorization: localStorage.token,
            },
          })
          .then((res) => {
            Swal.fire(
              `${res.data.message}`,
               "明天見😚", 
               "success"
               ).then((result) => {
                if (result.isConfirmed) {
                  window.location.assign("index.html");
                }
              })
           
          })
          .catch((err) => console.log(err.response));
  })
}
