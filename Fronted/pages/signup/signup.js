const name = document.querySelector("#name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const phone = document.getElementById("phone");

const submitBtn = document.querySelector(".signup-btn");

submitBtn.addEventListener("click", async () => {
  try {
    let user = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    };

    console.log(user)

    const response = await axios.post(
      "http://localhost:3000/user/register",
      user
    );

    // Destructure the response
    const { data, status } = response;

    if (status === 201) {
      alert("User registered successfully!");
    }

    email.value="";
    password.value="";
    phone.value="";
    name.value="";
  } catch (error) {
    // Handle errors
    if(error.response.data.message=="User allready exist"){
        alert("User already exist");
    }
  }
});
