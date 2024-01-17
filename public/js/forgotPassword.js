const handleReset = async (event) => {
    event.preventDefault();
  
    console.log("Reset Done");
    //Get form data inside the function to ensure you're getting the latest values
    const email = document.querySelector("#email").value
    console.log(email);
  
    // Prepare user data
    const userData = {
      email,
    };
  
    try {
      // Make a POST request to the registration endpoint with headers
      const response = await axios.post(
        "http://localhost:4900/api/v1/forgetPassword",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      // Handle the response data as needed
      console.log("Reset password sent successful:", response.data);
      document.getElementById("span").innerText = response.data.message;
    } catch (error) {
      console.log("Error in resetting password Login:", error.response.data);
      document.getElementById("span").innerText = `Reset password failed: ${error.response.data.message}`;
    }
  
  };

document.getElementById("ForgotpasswordForm").addEventListener("submit", handleReset);