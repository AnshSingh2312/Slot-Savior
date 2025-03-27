// This code retrieves the username from localStorage when the page loads
window.onload = function() {
    const username = localStorage.getItem('loggedInUser'); // Get the username from localStorage
  
    if (username) {
        document.getElementById("username-display").textContent = username; // Set the username in the display element
        const sidebarUsernameDisplay = document.getElementById("sidebar-username-display");
        if (sidebarUsernameDisplay) {
            sidebarUsernameDisplay.textContent = username; // Sidebar display
        }
    } else {
        document.getElementById("username-display").textContent = "Guest"; // Default display if no user is logged in
        if (sidebarUsernameDisplay) {
            sidebarUsernameDisplay.textContent = "Guest"; // Default sidebar display
        }
    }
  };
  
  // JavaScript to toggle the dropdown menu
  document.addEventListener('DOMContentLoaded', function () {
    const profileImg = document.getElementById('profile-img');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const userProfileButton = document.getElementById('user-profile');
  
    // Toggle dropdown visibility on profile image click
    profileImg.addEventListener('click', function () {
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
  
    // Close dropdown if clicked outside
    window.addEventListener('click', function (event) {
      if (!profileImg.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  
    if (userProfileButton) {
      userProfileButton.addEventListener('click', function() {
          window.location.href = "personaldetails1.html";
      });
  }
  });
