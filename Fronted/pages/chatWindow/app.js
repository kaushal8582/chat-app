const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected", socket.id);
});

const chat = document.getElementById("chat");

const sendBtn = document.getElementById("send");

const ChatBox = document.querySelector(".chat-messages");

const UserSectionBtn = document.querySelector(".user");
const GroupSectionBtn = document.querySelector(".group");
const groupBottom = document.querySelector(".groupBottom");
const userBottom = document.querySelector(".bottom");

const addMemberBtn = document.querySelector(".addmemberbtn");

const bottomCardSection = document.querySelector(".bottom");
const chatheader = document.querySelector(".chat-header h1");

const createGroupBtn = document.querySelector(".create-group");
const createGroupForm = document.querySelector(".chat-container>form");
const createGroupFormInput = document.querySelector(
  ".chat-container>form>input"
);
const createGroupFormsubmitBtn = document.querySelector(
  ".chat-container>form>button"
);

const addMemberContainer = document.querySelector(".addmembercontainer");
const memberBox = document.querySelector(".memberbox");

addMemberBtn.addEventListener("click", () => {
  addMemberContainer.style.display = "block";
  getMemberandAdd();
});

async function getMemberandAdd() {
  let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;
  try {
    const response = await axios.post(
      "http://localhost:3000/group/present-group-member",
      { groupid: groupid }
    );

    const responseSecond = await axios.post(
      "http://localhost:3000/group/not-present-group-member",
      { groupid: groupid }
    );

    console.log(response.data.data, responseSecond.data.data);

    let cluster = "";

    response.data.data.forEach((item) => {
      cluster += `<div class="showmember">
                    <h3>${item.name}</h3>
                    <button class="remove" id="${item.id}">remove</button>
                    ${
                      item.role === "admin"
                        ? `<button class="admin" id="${item.id}">admin</button>`
                        : `<button class="makeadmin" id="${item.id}">make admin</button>`
                    }
                  </div>`;
    });

    responseSecond.data.data.forEach((item) => {
      cluster += `<div class="showmember">
                <h3>${item.name}</h3>
                <button class="add" id="${item.id}" >add</button>
              </div>`;
    });

    document.querySelector(".memberbox").innerHTML = cluster;
  } catch (error) {
    console.log(error);
  }
}

async function addMember(user) {
  let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;

  try {
    const response = await axios.post(
      `http://localhost:3000/group/add-member-group/${groupid}`,
      {
        role: "member",
        userId: user,
      }
    );

    if (response.status == 200) {
      getMemberandAdd();
    }
  } catch (error) {
    console.log(error);
  }
}

async function removeMember(user) {
  let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;

  try {
    const response = await axios.post(
      "http://localhost:3000/group/remove-member",
      {
        groupid: groupid,
        userid: user,
      }
    );

    if (response.status == 200) {
      getMemberandAdd();
    }
  } catch (error) {
    console.log(error);
  }
}

async function makeAdmin(userid) {
  let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;

  try {
    const response = await axios.post(
      "http://localhost:3000/group/make-admin",
      {
        userid: userid,
        groupid: groupid,
      }
    );
    if (response.status == 200) {
      getMemberandAdd();
    }
  } catch (error) {
    console.log(error);
  }
}

memberBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    let id = e.target.id;
    removeMember(id);
  }

  if (e.target.classList.contains("add")) {
    let id = e.target.id;
    console.log(id);
    addMember(id);
  }

  if (e.target.classList.contains("makeadmin")) {
    let id = e.target.id;
    makeAdmin(id);
  }
});

UserSectionBtn.addEventListener("click", () => {
  GroupSectionBtn.classList.remove("active");
  UserSectionBtn.classList.add("active");
  groupBottom.style.display = "none";
  userBottom.style.display = "flex";
  createGroupBtn.style.display = "none";
});

GroupSectionBtn.addEventListener("click", () => {
  getAllGroups();
  GroupSectionBtn.classList.add("active");
  UserSectionBtn.classList.remove("active");
  groupBottom.style.display = "flex";
  userBottom.style.display = "none";
  createGroupBtn.style.display = "block";
});

createGroupBtn.addEventListener("click", () => {
  createGroupForm.style.display = "block";
});

createGroupFormsubmitBtn.addEventListener("click", () => {
  let groupName = createGroupFormInput.value;
  createGroup(groupName);
});

async function createGroup(name) {
  let sender = localStorage.getItem("loginid");
  let token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://localhost:3000/group/create",
      {
        name: name,
        userId: sender,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status == 200) {
      createGroupFormInput.value = "";
      createGroupForm.style.display = "none";
      getAllGroups();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllUser() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://localhost:3000/user/get-all-user",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log(response.data);
    const data = response.data.data;

    let cluster = "";
    data.forEach((item) => {
      cluster += ` <div class="card" id="${item.id}">
            ${item.name}
          </div>`;
    });

    document.querySelector(".bottom").innerHTML = cluster;
  } catch (error) {
    console.log(error);
  }
}

async function getGroupMsg() {
  let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;
  let token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:3000/group/get-group-msg",
      {
        groupId: groupid,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status == 200) {
      let data = response.data.data;
      console.log(data);
      renderGroupMsgInFronted(data);
    }
  } catch (error) {
    console.log(error);
  }
}

function renderGroupMsgInFronted(data) {
  let sender = localStorage.getItem("loginid");
  ChatBox.innerHTML = "";
  data.forEach((item) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${item.senderId == sender ? "act" : ""}`;
    messageDiv.textContent = item.content;
    ChatBox.appendChild(messageDiv);
  });
}

async function sendMessageInGroup(msg, sender, groupid, name) {
  let token = localStorage.getItem("token");
  socket.emit("sendGroupMsg", { msg, sender, groupid, name });
  chat.value = "";
}

socket.on("receiveMessage", (data) => {
  let sender = localStorage.getItem("loginid");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${data.senderId == sender ? "act" : ""}`;
  messageDiv.textContent = data.content;
  ChatBox.appendChild(messageDiv);

  console.log(data);
});

socket.on("receivePersonalMessage", (data) => {
  console.log("good morninf");
  let sender = localStorage.getItem("loginid");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${data.senderId == sender ? "act" : ""}`;
  messageDiv.textContent = data.message;
  ChatBox.appendChild(messageDiv);

  console.log(data);
});

getAllUser();

bottomCardSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    let text = e.target.innerText;
    let id = e.target.id;

    localStorage.setItem(
      "clickedUser",
      JSON.stringify({ name: text, id: id, personal: true })
    );
    chatheader.innerText = text;
    let sender = localStorage.getItem("loginid");

    console.log(sender + id);
    let value = sender + id;
    const sortedValue = value.split("").sort().join("");

    console.log(sortedValue);

    socket.emit("joinusergroup", sortedValue);
    getAllChatPerPerson();
  }
});

groupBottom.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    let text = e.target.innerText;
    let id = e.target.id;

    localStorage.setItem(
      "clickedUser",
      JSON.stringify({ name: text, id: id, personal: false })
    );
    chatheader.innerText = text + "(group)";
    addMemberContainer.style.display = "none";
    // getAllChatPerPerson();

    socket.emit("joingroup", text);

    checkGroupAdmin();
    getGroupMsg();
  }
});

async function checkGroupAdmin() {
  let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;
  let sender = localStorage.getItem("loginid");

  try {
    const response = await axios.post(
      "http://localhost:3000/group/check-admin",
      {
        groupid: groupid,
        userid: sender,
      }
    );

    let value = response.data.data;

    if (value) {
      addMemberBtn.style.display = "block";
    } else {
      addMemberBtn.style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllGroups() {
  let sender = localStorage.getItem("loginid");
  let token = localStorage.getItem("token");
  console.log(sender);
  try {
    const response = await axios.post(
      "http://localhost:3000/group/get-all-groups",
      {
        userid: sender, // Data goes in the request body
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const data = response.data.Data;
    console.log(data);

    let cluster = "";
    data.forEach((item) => {
      cluster += ` <div class="card" id="${item.id}">
            ${item.name}
          </div>`;
    });

    groupBottom.innerHTML = cluster;
  } catch (error) {
    console.log(error);
  }
}

async function sendMsgOnPerson(msg) {
  try {
    let token = localStorage.getItem("token");
    let receiver = JSON.parse(localStorage.getItem("clickedUser")).id;
    let sender = localStorage.getItem("loginid");
    // let response = await axios.post(
    //   "http://localhost:3000/chat/add-chat",
    //   { chat: msg, receiverId: receiver, senderId: sender },
    //   {
    //     headers: {
    //       Authorization: token,
    //     },
    //   }
    // );

    // if (response.status == 200) {
    //   chat.value = "";
    //   // getAllChat();
    //   getAllChatPerPerson();
    //   // alert("data added");
    // }

    let value = sender + receiver;
    const sortedValue = value.split("").sort().join("");

    socket.emit("sendMsg", { msg, receiver, sender });
  } catch (error) {
    console.log(error);
  }
}

async function getAllChatPerPerson() {
  let token = localStorage.getItem("token");
  let receiver = JSON.parse(localStorage.getItem("clickedUser")).id;
  let sender = localStorage.getItem("loginid");

  try {
    console.log("click call to");

    const response = await axios.get(
      `http://localhost:3000/chat/get-all-chat/${receiver}/${sender}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const data = response.data.data;

    renderInHtml(data);
  } catch (error) {
    console.log(error);
  }
}

getAllChatPerPerson();

function renderInHtml(data) {
  let sender = localStorage.getItem("loginid");
  console.log("data", data);
  let cluster = "";
  data.forEach((item) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${item.senderId == sender ? "act" : ""}`;
    messageDiv.textContent = item.message;
    ChatBox.appendChild(messageDiv);
  });
}

async function getAllChat() {
  const token = localStorage.getItem("token") || [];

  try {
    let allData = JSON.parse(localStorage.getItem("data"));
    //  console.log(allData[allData.length-1].createdAt)

    let time =
      (allData &&
        allData.length > 0 &&
        allData[allData.length - 1].createdAt) ||
      "0";

    const response = await axios.get(
      `http://localhost:3000/chat/get-all-chat/${time}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log(allData);
    let newArrya;
    if (allData) {
      newArrya = allData.concat(response.data.data);
      console.log("n", newArrya);
    } else {
      newArrya = response.data.data || [];
    }

    console.log(newArrya);

    const lastTenChats = newArrya.slice(-10);
    localStorage.setItem("data", JSON.stringify(lastTenChats));
    renderInHtml(lastTenChats);
  } catch (error) {
    console.log(error);
  }
}

// getAllChat();

const sendFileBtn = document.querySelector(".send-file");
const fileInput = document.querySelector(".file");
const imgSendBtn = document.querySelector(".imgSendBtn");
const imgShowBOx = document.querySelector(".demoImgShow");
const imgShowBOxImg = document.querySelector(".demoImgShow img");

let selectedFile = null;

sendFileBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  // e.preventDefault();
  let file = e.target.files[0];

  selectedFile = file;

  const tempUrl = URL.createObjectURL(file);
  imgShowBOxImg.src = tempUrl;
  imgShowBOx.style.display = "block";
});

// imgSendBtn.addEventListener("click", async (e) => {
//   if (!selectedFile) {
//     return alert("file is not selected");
//   }

//   uploadFile();
// });

imgSendBtn.addEventListener("click", async (e) => {
  e.preventDefault()
  console.log(e)
  console.log("imgsend btn")
  if (!selectedFile) {
    return alert("File is not selected");
  }
  uploadFile();
});

async function uploadFile() {
  const formData = new FormData();
  formData.append("img", selectedFile);
  // console.log(formData)

  console.log("form data to",formData);
  try {
    console.log("something")
    const response = await axios.post(
      "http://localhost:3000/group/upload-img",
      formData
    );

    // if (response.status == 200) {
    //   alert("img send successfully");
    //   // imgShowBOx.style.display = 'none'
    //   console.log(response.data.data);
    // }


  } catch (error) {
    console.log(error);
  }
}

// window.onbeforeunload = function () {
//   alert("Page is about to reload");
// };



sendBtn.addEventListener("click", async () => {
  if (selectedFile) {
    uploadFile();
    return;
  }

  let text = chat.value;
  if (!text || text.trim() == "") {
    return;
  }

  if (UserSectionBtn.classList.contains("active")) {
    sendMsgOnPerson(text);
  }

  if (GroupSectionBtn.classList.contains("active")) {
    let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;
    let name = JSON.parse(localStorage.getItem("clickedUser")).name;
    let senderid = localStorage.getItem("loginid");
    sendMessageInGroup(text, senderid, groupid, name);
  }
});
