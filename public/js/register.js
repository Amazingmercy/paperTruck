const handleRegistration = async (event) => {
    event.preventDefault();
  
    //Get form data inside the function to ensure you're getting the latest values
    const departmentName = document.querySelector("#department").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
    
  
    // Prepare user data
    const userData = {
      departmentName,
      email,
      password,
      confirmPassword
    };
  
    console.log('Request data:', userData)
    try {
      // Make a POST request to the registration endpoint with headers
      const response = await axios.post(
        "http://localhost:4900/api/v1/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      // Handle the response data as needed
      console.log("Registration successful:", response.data);
      document.getElementById("span").innerText = "Registration successful";
      window.location.href = './login.html'
    } catch (error) {
      console.log("Error registering user:", error.response.data);
      document.getElementById("span").innerText = `Registration failed: ${error.response.data.message}`;
    }
  };

document.getElementById("registrationForm").addEventListener("submit", handleRegistration);