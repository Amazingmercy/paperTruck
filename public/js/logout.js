async function handleLogout() {
    // Perform any necessary logout actions, such as clearing session data or making API requests.
    try{
        await axios.post(
            "http://localhost:4900/api/v1/logout",
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    }catch (error) {
        console.log("Error in user Logout:", error.response.data);
    }
    
    //clear a user token from local storage
    localStorage.removeItem('userToken');
    window.location.href = '../public/login.html';
}


document.getElementById('logoutButton').addEventListener('click', handleLogout);