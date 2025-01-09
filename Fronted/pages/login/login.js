const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.querySelector(".login-btn");



loginBtn.addEventListener("click",async()=>{
    let ema = email.value;
    let pass = password.value;

    if(!ema||!pass){
        return alert("All fileds are required");
    }

    let user = {
        email:ema,
        password:pass
    }

    try {
        const response = await axios.post("http://localhost:3000/user/login",user);   
        const{data,status} = response;
        localStorage.setItem("token",data.token);
        localStorage.setItem('loginid',data.id)
        if(status==200){
           window.location.href ="/Fronted/pages/chatWindow/index.html"
        }
    } catch (error) {
        console.log(error)
    }


})