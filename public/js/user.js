// userDashboard.js
import { getAuthToken } from './auth.js';
const authToken = getAuthToken();

async function viewStars() {
    try{
        await axios.get(
            "http://localhost:4900/api/v1/topDepartments",
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
              },
            }
          );

    } catch (error){
        console.log("Error in user display:", error.response.data.message);
    }
    window.location.href = '../public/stars.html';
}



async function viewCompetitors(){
  try{
    await axios.get(
        "http://localhost:4900/api/v1/departments",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          },
        }
      );

} catch (error){
    console.log("Error in user display:", error.response.data.message);
}
    
  window.location.href = '../public/competitors.html';
}


function viewReward() {
    window.location.href = '../public/reward.html';
  }



  
  
  
// You can call this function when the user clicks on a logout button or link

document.getElementById('competitorsButton').addEventListener('click', viewCompetitors);
document.getElementById('starsButton').addEventListener('click', viewStars);
document.getElementById('rewardButton').addEventListener('click', viewReward);
  