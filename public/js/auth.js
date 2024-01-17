// auth.js

// Function to retrieve the authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('userToken');
};

const getUserId = () => {
  return localStorage.getItem('userId');
};




// Export the function for use in other files
export { getAuthToken , getUserId };
