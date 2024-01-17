const storedUserId = localStorage.getItem('userId');
const storedUserToken = localStorage.getItem('userToken');
const submitBtn = document.querySelector('#myForm')


document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.getElementById('adminNav').querySelectorAll('a');
    const contentSections = document.querySelectorAll('.content-section');
    const adminSection = document.querySelectorAll('.admin-section');


    let currentSectionId = 'viewOneCompetitorSection';

    function showSection(sectionId) {
        contentSections.forEach(function (section) {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    
        adminSection.forEach(function (section) {
            section.style.display = 'none';
        });

        currentSectionId = sectionId;
    }
    
    showSection(currentSectionId)



    function commonFunction(event) {
        event.preventDefault();

        const targetSectionId = event.currentTarget.getAttribute('data-target');
        showSection(targetSectionId + 'Section');
    }


    navLinks.forEach(function (link) {
        link.addEventListener('click', commonFunction);
    });


    const form = document.getElementById('myForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const departmentName = document.querySelector("#departmentName").value;
            const span = document.getElementById('mspan');
            
                const data = {
                    departmentName: departmentName
                }

                if (!data.departmentName) {
                    span.innerHTML = 'Enter Department Name';
                    return;
                }


            try{
                // Make a GET request to the server endpoint
                const id = await axios.post(
                    "http://localhost:4900/api/v1/admin/id",
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${storedUserToken}`,
                        },
                    }
                );
                const userId = id.data;
                
                const response = await axios.get(
                    `http://localhost:4900/api/v1/admin/oneParticipant/${userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${storedUserToken}`,
                        },
                    }
                );

                const dataList = document.getElementById("data");
                dataList.innerHTML = '';

                const user = response.data;

                // Display user data in the h2 tag
                dataList.innerHTML = 'Department Name: ' + user.departmentName + '<br> ID: '+ user._id + '<br> Bin Points: '+ user.binPoints + '<br> Reward:' + user.reward + '<br> Email:' + user.email + '<br>'

                // Create buttons for updateReward, updatePoints, and delete user
                const updateRewardButton = document.createElement('button');
                updateRewardButton.textContent = 'Update Reward';
                updateRewardButton.addEventListener('click', () => updateReward(user._id, storedUserToken));


                const updatePointsButton = document.createElement('button');
                updatePointsButton.textContent = 'Update Points';
                updatePointsButton.addEventListener('click', () => updatePoints(user._id, storedUserToken));


                const pointsNotificationButton = document.createElement('button');
                pointsNotificationButton.textContent = 'Points Notification';
                pointsNotificationButton.addEventListener('click', () => pointsNotify(user._id, storedUserToken));


                const rewardNotificationButtton = document.createElement('button');
                rewardNotificationButtton.textContent = 'Reward Notification';
                rewardNotificationButtton.addEventListener('click', () => rewardNotify(user._id, storedUserToken));


                const deleteUserButton = document.createElement('button');
                deleteUserButton.textContent = 'Delete User';
                deleteUserButton.addEventListener('click', () => deleteUser(user._id, storedUserToken));

                // Append buttons to the school element
                dataList.appendChild(updateRewardButton);
                dataList.appendChild(updatePointsButton);
                dataList.appendChild(pointsNotificationButton);
                dataList.appendChild(rewardNotificationButtton);
                dataList.appendChild(deleteUserButton);

                // Show the targeted content section after fetching data
                const targetSectionId = form.getAttribute('data-target');
                const targetSection = document.getElementById(targetSectionId + 'Section');
                if (targetSection) {
                    targetSection.style.display = 'block';

                    adminSection.forEach(function (section) {
                        section.style.display = 'none';
                    });
                }

                showSection('OneCompetitorSection')
            } catch (error) {
                span.innerHTML =  error.response ? error.response.data.message : error.response.message
                console.log(error.response.data.message)
            }

    

            
        });
    }
});



const displayCompetitors = async(userToken) => {
    try{
        const data = await axios.get(
            "http://localhost:4900/api/v1/admin/participants",
            {
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userToken}`,
              },
            }
          );
    
          const schoolsList = document.getElementById("schoolsList");
    
          // Clear existing list items
          schoolsList.innerHTML = '';
    
          // Loop through the data and create list items
          data.data.forEach(item => {
              const li = document.createElement("li");
              li.className = "school-item";
    
              const schoolName = document.createElement("li");
              schoolName.className = "school-name";
              schoolName.textContent = item.departmentName;
    
              
              li.appendChild(schoolName);
              schoolsList.appendChild(li);
          });
    
    }catch (error) {
        span.innerHTML =  error.response ? error.response.data.message : error.response.message
        console.log("Error in user display:", error);
    }
    
}
    
displayCompetitors(storedUserToken);


const displayLogs = async(userToken) => {
    try{
        const data = await axios.get(
            "http://localhost:4900/api/v1/admin/logs",
            {
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userToken}`,
              },
            }
          );
          const logsList = document.getElementById("LogsList");

          // Clear existing list items
          logsList.innerHTML = '';
          // Add an h3 heading
            const heading = document.createElement("h3");
            heading.textContent = "UserId and Routes";
            logsList.appendChild(heading);
          
          // Loop through the data and create list items
          data.data.forEach(item => {
              const li = document.createElement("li");
              li.className = "log-item";
          
              // Combine logName and logUser with a space in between
              const combinedText = document.createTextNode(`${item.userId} ${item.action}`);
              li.appendChild(combinedText);
              logsList.appendChild(li);
          });
    
    }catch (error) {
        span.innerHTML =  error.response ? error.response.data.message : error.response.message
        console.log(error.response.data.message)
    }
    
}

displayLogs(storedUserToken);

    


const updateReward = async (userId, userToken) => {
    const span = document.querySelector('#fspan');
    
    //Assuming you have a prompt for the new reward, or you can get it from user input
    const updatedReward = prompt("Enter the new reward");
    
        if (!updatedReward) {
            span.innerHTML = 'Please enter a valid reward';
            return;
        }
    
        const data = {
            reward: updatedReward
        };

        console.log(data)

        try{
            const response = await axios.put(
            `http://localhost:4900/api/v1/admin/reward/${userId}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${userToken}`,
                },
            }
        )

        console.log(response)
            // Handle success, maybe update UI or show a success message
            span.innerHTML = "Reward added successfully"
        } catch(error){
            span.innerHTML =  error.response ? error.response.data.message : error.response.message
            console.log(error.response.data.message)
        }
}


const updatePoints = async(userId, userToken, newPoints) => {
        const span = document.querySelector('#fspan');
    
        // Assuming you have a prompt for the new reward, or you can get it from user input
        const updatedPoints = newPoints || prompt("Enter the new Points:");
    
        if (!updatedPoints || updatedPoints === NaN) {
            span.innerHTML = 'Please enter a valid Point';
            return;
        }
    
        const data = {
            points: updatedPoints
        };

        try{
    
        await axios.put(
            `http://localhost:4900/api/v1/admin/points/${userId}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${userToken}`,
                },
            }
        )
        
            // Handle success
            span.innerHTML = 'Points added successfully'
        } catch (error) {
            span.innerHTML =  error.response ? error.response.data.message : error.response.message
            console.log(error.response.data.message)
        }
}


const rewardNotify = async(userId, userToken) => {
    const span = document.querySelector('#fspan');

    try{

    const response = await axios.get(
        `http://localhost:4900/api/v1/admin/reward/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userToken}`,
            },
        }
    )
    
        // Handle success, maybe update UI or show a success message
        span.innerHTML = 'Reward Notification sent!'
        console.log(response)
    } catch (error) {
        span.innerHTML =  error.response ? error.response.data.message : error.response.message
        console.log(error.response.data.message)
    }
}


const deleteUser = async(userId, userToken) => {
    const span = document.querySelector('#fspan');

    try{

    const response = await axios.delete(
        `http://localhost:4900/api/v1/admin/oneParticipant/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userToken}`,
            },
        }
    )
    
        // Handle success, maybe update UI or show a success message
        span.innerHTML = 'User deleted successfully'
        location.reload()
    } catch (error) {
        span.innerHTML =  error.response ? error.response.data.message : error.response.message
        console.log(error.response.data.message)
    }
}



const pointsNotify = async(userId, userToken) => {
    const span = document.querySelector('#fspan');

    try{

    await axios.get(
        `http://localhost:4900/api/v1/admin/points/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${userToken}`,
            },
        }
    )
    
        // Handle success, maybe update UI or show a success message
        span.innerHTML = 'Points Notification sent!'
    } catch (error) {
        span.innerHTML =  error.response ? error.response.data.message : error.response.message
        console.log(error.response.data.message)
    }
}


const goBackLink = document.getElementById('goBackLink');
if (goBackLink) {
    goBackLink.addEventListener('click', function (event) {
        event.preventDefault();
        location.reload();
    });
}
    
    
    
    