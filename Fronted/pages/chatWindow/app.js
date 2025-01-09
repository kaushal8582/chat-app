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
    const response = await axios.post('http://localhost:3000/group/make-admin',{
      userid:userid,
      groupid:groupid
    })
    if(response.status==200){
      getMemberandAdd();
    }
  } catch (error) {
    console.log(error)
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

  if(e.target.classList.contains("makeadmin")){
    let id = e.target.id;
    makeAdmin(id)
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
  // console.log("data", data);   
  let cluster = "";
  data.forEach((item) => {
    cluster += `<div class="message ${item.senderId == sender ? "act" : ""} ">${
      item.content
    }</div>`;
  });
  ChatBox.innerHTML = cluster;
}

async function sendMessageInGroup(msg, sender, groupid) {
  let token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:3000/group/send-message",
      {
        msg: msg,
        groupId: groupid,
        senderId: sender,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log(response);

    if (response.status == 200) {
      getGroupMsg()
      // alert("msg send");
    }
  } catch (error) {
    console.log(error);
  }
}

getAllUser();

bottomCardSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    let text = e.target.innerText;
    let id = e.target.id;

    localStorage.setItem("clickedUser", JSON.stringify({ name: text, id: id,personal:true }));
    chatheader.innerText = text;
    getAllChatPerPerson();
  }
});

groupBottom.addEventListener("click", (e) => {
  if (e.target.classList.contains("card")) {
    let text = e.target.innerText;
    let id = e.target.id;

    localStorage.setItem("clickedUser", JSON.stringify({ name: text, id: id,personal:false }));
    chatheader.innerText = text + "(group)";
    addMemberContainer.style.display = "none";
    // getAllChatPerPerson();
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

sendBtn.addEventListener("click", async () => {
  let text = chat.value;
  if (!text || text.trim() == "") {
    return;
  }

  if (UserSectionBtn.classList.contains("active")) {
    sendMsgOnPerson(text);
  }

  if (GroupSectionBtn.classList.contains("active")) {
    let groupid = JSON.parse(localStorage.getItem("clickedUser")).id;
    let senderid = localStorage.getItem("loginid");
    sendMessageInGroup(text, senderid, groupid);
  }
});

async function sendMsgOnPerson(msg) {
  try {
    let token = localStorage.getItem("token");
    let receiver = JSON.parse(localStorage.getItem("clickedUser")).id;
    let sender = localStorage.getItem("loginid");
    let response = await axios.post(
      "http://localhost:3000/chat/add-chat",
      { chat: msg, receiverId: receiver, senderId: sender },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status == 200) {
      chat.value = "";
      // getAllChat();
      getAllChatPerPerson();
      // alert("data added");
    }
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
    cluster += `<div class="message ${item.senderId == sender ? "act" : ""} ">${
      item.message
    }</div>`;
  });
  ChatBox.innerHTML = cluster;
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

setInterval(() => {

  let personal = JSON.parse(localStorage.getItem("clickedUser")).personal
  // console.log(personal)

  if(personal){
    // getAllChat()
    getAllChatPerPerson()
  }else{
    getGroupMsg()
  }


}, 10 * 1000);

// getAllChat();
