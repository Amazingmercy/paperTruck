

//Function to handle form login 
const handleLogin = async (event) => {
  event.preventDefault();

  //Get form data inside the function to ensure you're getting the latest values
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const span = document.querySelector('#span')
  

  // Prepare user data
  const userData = {
    email,
    password,
  };

  try {
    // Make a POST request to the registration endpoint with headers
    const response = await axios.post(
      "http://localhost:4900/api/v1/login",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    const {token, userId, userRole} = response.data;

    localStorage.setItem('userId', userId);
    localStorage.setItem('userToken', token);

  
    if(userRole == 'admin'){
      window.location.href = './adminDashboard.html';
    } else {
      window.location.href = './userDashboard.html';
    }
    return { userId, token };
  } catch (error) {
    console.log("Error in user Login:", error.response);
    span.innerHTML= `Login failed: ${error.response.data.message}`;
  }
};




  
  // Your code here
  
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
//});

