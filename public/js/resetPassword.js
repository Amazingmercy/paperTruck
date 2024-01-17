

//Function to handle form login 
const handleResetPassword = async (event) => {
    event.preventDefault();
  
    //Get form data inside the function to ensure you're getting the latest values
    const password = document.querySelector("#password").value;
    const url = window.location.href;
    const urlSearchParams = new URLSearchParams(url.split('?')[1]);
    const token = urlSearchParams.get('token');

    console.log(token);

  
    // Prepare user data
    const userData = {
      password,
    };
  
    console.log('Request data:', userData)
    try {
      // Make a POST request to the registration endpoint with headers
      const response = await axios.put(
        `http://localhost:4900/api/v1/resetPassword/${token}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      // Handle the response data as needed
      console.log("Reset successful:", response.data);
      document.getElementById("span").innerText = "Password reset successful";
    } catch (error) {
      console.log("Error in user Login:", error.response.data);
      document.getElementById("span").innerText = `Login failed: ${error.response.data.message}`;
    }
  };
  
  
  
  
    
    // Your code here
    
    document.getElementById("resetPasswordForm").addEventListener("submit", handleResetPassword);
  //});
  
  