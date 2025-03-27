// Sample credentials for login 
const validCredentials = [
  { username: "user1", password: "p1", carNoPlate: "MH01AA1111"},
  { username: "user2", password: "p2", carNoPlate: "MH02AA2222"},
  { username: "user3", password: "p3", carNoPlate: "MH03AA3333"},
  { username: "user4", password: "p4", carNoPlate: "MH04AA4444"}
];

let currentUsername = '';
let currentCarNoPlate= '';
let selectedArea = '';
let selectedSlot = '';
let qrCodeImage = '';
let reservations = [];
let previousSlot = null;

// Login-Page
document.getElementById('login-form').onsubmit = function(event) {
  event.preventDefault();

  const username = event.target[0].value;  
  const password = event.target[1].value;  

  const validUser = validCredentials.some(cred => 
      cred.username === username && cred.password === password
  );

  if (validUser) {
      localStorage.setItem('loggedInUser', username); // Store the logged-in user's name
      showDashboard();  
  } else {
      alert("Invalid username or password.");
  }
};

function showLoginPage() {
  window.location.href = "login.html";
}

function showDashboard() {
  window.location.href = "dashboard.html";
}

// function processPayment() {
//   let paymentMethod = document.getElementById("paymentMethod").value;
  
//   // Simulate successful payment
//   document.getElementById("paymentPopup").style.display = "block";
  
//   // Delay to simulate processing, then redirect to entry pass
//   setTimeout(() => {
//       window.location.href = "entrypass.html";
//   }, 2000);
// }

function searchParkingArea() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const areas = document.querySelectorAll('.area');

  areas.forEach(area => {
      const title = area.querySelector('h2').innerText.toLowerCase();
      if (title.includes(input)) {
          area.style.display = ''; // Show matching area
      } else {
          area.style.display = 'none'; // Hide non-matching area
      }
  });
}

function showSlotSelection(area) {
  selectedArea = area; // Fixed variable usage
  localStorage.setItem('selected-Area', selectedArea); 
  window.location.href = `slotSelection.html?selectedArea=${encodeURIComponent(selectedArea)}`;
}

function selectSlot(slot) {
  selectedSlot = slot; // Fixed variable usage
  populateTimeDropdowns(); // Populate time dropdowns when slot is selected
  document.getElementById('booking-page').style.display = 'block';
}

// Function to get query parameter by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function populateTimeDropdowns() {
  const hours = document.querySelectorAll('#entry-hour');
  const minutes = document.querySelectorAll('#entry-minute');

  // Populate hours (1-12)
  for (let i = 1; i <= 12; i++) {
      const hourOption = document.createElement('option');
      hourOption.value = i < 10 ? '0' + i : i;
      hourOption.textContent = i < 10 ? '0' + i : i;
      hours.forEach(hourSelect => hourSelect.appendChild(hourOption.cloneNode(true)));
  }
    // Populate minutes (00, 15, 30, 45)
    const minuteOptions = ['00', '15', '30', '45'];
    minuteOptions.forEach(minute => {
        const minuteOption = document.createElement('option');
        minuteOption.value = minute;
        minuteOption.textContent = minute;
        minutes.forEach(minuteSelect => minuteSelect.appendChild(minuteOption.cloneNode(true)));
    });
  
    // Populate AM/PM
    const ampmSelects = document.querySelectorAll('#entry-ampm');
    ['AM', 'PM'].forEach(ampm => {
        const ampmOption = document.createElement('option');
        ampmOption.value = ampm;
        ampmOption.textContent = ampm;
        ampmSelects.forEach(ampmSelect => ampmSelect.appendChild(ampmOption.cloneNode(true)));
    });
  }

function populateDurationDropdown() {
  const durationSelect = document.getElementById('duration');
  durationSelect.innerHTML = ''; // Clear existing options

  // Populate duration options (1 to 12 hours)
  for (let i = 1; i <= 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i} Hour${i > 1 ? 's' : ''}`;
      durationSelect.appendChild(option);
  }
}

function showBookingForm(slot, button) {
  localStorage.setItem('selected-Slot', slot); 
  
  if (previousSlot) {
      previousSlot.nextElementSibling.remove();
  }
  // Show the booking form
  
  const bookingForm = document.getElementById('booking-page');
  const clonedForm = bookingForm.cloneNode(true);
  clonedForm.style.display = 'block';
  clonedForm.id = '';

  button.parentElement.after(clonedForm);
  clonedForm.querySelector('#booking-title').textContent = `Booking for ${slot}`;
  populateTimeDropdowns(); 
  populateDurationDropdown();
  previousSlot = button.parentElement;
}

function handleBooking(event) {
  event.preventDefault();

  const date = document.getElementById('date').value;
  const entryHour = document.getElementById('entry-hour').value;
  const entryMinute = document.getElementById('entry-minute').value;
  const entryAmpm = document.getElementById('entry-ampm').value;
  const duration = document.getElementById('duration').value;
  const carNoPlate = document.getElementById('car-noplate').value;

  const selectedArea = localStorage.getItem('selected-Area');   
  const selectedSlot = localStorage.getItem('selected-Slot');   

  const errorMessage = document.getElementById("error-message");

  // Basic validation
  if (!date || !entryHour || !entryMinute || !entryAmpm || !duration || !carNoPlate) {
      errorMessage.textContent = "Please fill in all fields.";
      return;
  }
  
  // Calculate price (assuming ₹30 per hour)
  const price = duration * 30;
  const startTime = `${entryHour}:${entryMinute} ${entryAmpm}`;

   // Store booking details in localStorage
   localStorage.setItem('bookingDate', date);
   localStorage.setItem('bookingTime', startTime);
   localStorage.setItem('bookingDuration', duration);
   localStorage.setItem('bookingCarNoPlate', carNoPlate);
   localStorage.setItem('bookingPrice', price); // Store price

   // Redirect to payment page
   window.location.href = "payment.html";

  const uniqueId = Date.now();
  const qrData = `${carNoPlate}`;
  const reservation = {
      username: localStorage.getItem('loggedInUser'),
      area: selectedArea || 'Unknown Area',
      slot: selectedSlot || 'Unknown Slot',
      date,
      startTime,
      duration,
      carNoPlate,
  };

  let reservations = JSON.parse(localStorage.getItem(`reservations_${reservation.username}`)) || [];
  reservations.push(reservation);
  
  localStorage.setItem("bookingDuration", duration);
  localStorage.setItem("bookingTime", startTime);
  localStorage.setItem('bookingCarNoPlate', carNoPlate);
  localStorage.setItem(`reservations_${reservation.username}`, JSON.stringify(reservations));
  document.querySelector('.booking-form').parentElement.style.display = 'none';
  
  showEntryPass(reservation.username, selectedSlot, date, startTime, duration,  carNoPlate, qrData);
  alert(`Booking successful for ${carNoPlate} on ${date} for ${duration} hours!`);
  document.querySelector('.booking-form form').reset();
  
  if (previousSlot) {
      previousSlot.nextElementSibling.remove();
      previousSlot = null;
  }
}

function convertTo24Hour(time) {
  let [hour, minute] = time.split(':');
  const ampm = minute.split(' ')[1];
  minute = minute.split(' ')[0];

  if (ampm === 'PM' && hour < 12) {
      hour = parseInt(hour) + 12;
  } else if (ampm === 'AM' && hour == 12) {
      hour = '00';
  }

  return `${hour}:${minute}`;
}

function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

function showEntryPass(username, selectedSlot, date, startTime, duration, carNoPlate, qrData) {
  const storedTime = localStorage.getItem("bookingTime") || startTime;
  const storedDuration = localStorage.getItem("bookingDuration") || duration;
  const storedPrice = localStorage.getItem("bookingPrice") || duration * 30;
  if(selectedSlot){
      switch (selectedSlot) {
          case 'Slot 1':
              qrCodeImage = 'images/qr-1.png'; // Path to QR code image for Slot 1
              break;
          case 'Slot 2':
              qrCodeImage = 'images/qr-2.jpeg'; // Path to QR code image for Slot 2
              break;
          case 'Slot 3':
              qrCodeImage = 'images/qr-3.jpeg'; // Path to QR code image for Slot 3
              break;
          case 'Slot 4':
              qrCodeImage = 'images/qr-4.jpeg'; // Path to QR code image for Slot 4
              break;
          default:
              qrCodeImage = 'images/default-qr.jpeg'; // Default QR code
              break;
      }
  }

  // Show the entry pass with the details
  const entryPass = document.getElementById('entry-pass');
  entryPass.style.display = 'block';

  const passDetails = document.getElementById('entry-pass-details');
  
  // Fill in the pass details
  passDetails.innerHTML = `
  <p><strong>Name:</strong> ${username}</p>
  <p><strong>Selected Slot:</strong> ${selectedSlot}</p>
  <p><strong>Date:</strong> ${date}</p>
  <p><strong>Entry Time:</strong> ${startTime}</p>
  <p><strong>Duration:</strong> ${duration} hours</p> <!-- Updated this line -->
  <p><strong>Car No Plate:</strong> ${carNoPlate}</p>
  
  <p><strong>Total Price:</strong> ₹${storedPrice}</p> 
  <img src="${qrCodeImage}" alt="QR Code" style="width: 150px; height: 150px;"/> <!-- Display QR code image -->
  `;

}

function showReservationPage() {
  window.location.href = "reservations.html";
}

function showReservations() {
  const reservationDetailsDiv = document.getElementById('reservation-details');
  reservationDetailsDiv.innerHTML = '';

  const username = localStorage.getItem('loggedInUser'); // Get logged-in username
  let reservations = JSON.parse(localStorage.getItem(`reservations_${username}`)) || [];

  if (reservations.length === 0) {
      reservationDetailsDiv.innerHTML = '<p>No reservations found.</p>';
      return ;
  }
  else {
      reservations.forEach((reservation, index) => {
          // Logic to determine the correct QR code image based on the selected slot
          let qrCodeImage = '';
          switch (reservation.slot) {
              case 'Slot 1':
                  qrCodeImage = 'images/qr-1.png';
                  break;
              case 'Slot 2':
                  qrCodeImage = 'images/qr-2.jpeg';
                  break;
              case 'Slot 3':
                  qrCodeImage = 'images/qr-3.jpeg';
                  break;
              case 'Slot 4':
                  qrCodeImage = 'images/qr-4.jpeg';
                  break;
              default:
                  qrCodeImage = 'images/default-qr.jpeg'; // Default QR code
                  break;
          }

          // Retrieve stored price or calculate dynamically
          let price = reservation.duration * 30;

          // Generate reservation card with all details
          reservationDetailsDiv.innerHTML += `
              <div class="nice">
                  <div class="reservation-item">
                      <h2>Reservation #${index + 1}</h2>
                      <p><strong>Name:</strong> ${reservation.username}</p>
                      <p><strong>Car No Plate:</strong> ${reservation.carNoPlate}</p>
                      <p><strong>Date:</strong> ${reservation.date}</p>
                      <p><strong>Entry Time:</strong> ${reservation.startTime}</p>
                      <p><strong>Duration:</strong> ${reservation.duration} hours</p>
                      <p><strong>Parking Area:</strong> ${reservation.area}</p>
                      <p><strong>Parking Slot:</strong> ${reservation.slot}</p>
                      <p><strong>Total Price:</strong> ₹${price}</p>
                  </div>
              <!-- Entry Pass QR Code -->
              <div class="qrImaagess">
                  <div id="entry-pass-${index}" class="entry-pass">
                      <div id="qrimage" class="qrimages">
                          <img src="${qrCodeImage}" alt="QR Code" style="width: 150px; height: 150px;" />
                      </div>
                  </div>
              </div>
              </div>
              
          `;
          // Generate QR code for the reservation (removed)
          // const qrCodeDiv = document.getElementById(`qr-code-reservation-${index}`);
          // qrCodeDiv.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(reservation.qrData)}" alt="QR Code">`;
      });
  }
}

function showHelpPage() {
  window.location.href = "help.html";
  document.getElementById('help-page').style.display = 'block';
}

function showPersonalDetailsPage() {
  window.location.href = "personaldetails1.html";
}

// Function to save user information
function saveUserInfo(event) {
  event.preventDefault(); // Prevent form from submitting normally

  // Collecting user data
  const userName = document.getElementById("userName").value;
  const userEmail = document.getElementById("userEmail").value;
  const userPhone = document.getElementById("userPhone").value;
  const userPhoto = document.getElementById("userPhoto").files[0]; // Get the selected file

  // Validate inputs
  if (!userName || !userEmail) {
      alert("Name and Email are required.");
      return; // Exit the function if validation fails
  }

  // Create a FormData object to hold the form data
  const formData = new FormData();
  formData.append("name", userName);
  formData.append("email", userEmail);
  formData.append("phone", userPhone);
  if (userPhoto) {
      formData.append("photo", userPhoto); // Append the file if provided
  }

  // Example: Log the user information to console (You can replace this with an API call)
  console.log("User Information:");
  console.log("Name:", userName);
  console.log("Email:", userEmail);
  console.log("Phone:", userPhone);
  if (userPhoto) {
      console.log("Profile Picture:", userPhoto.name);
  }

  // You can replace this part with your API call to save data on the server
  // Example: 
  // fetch('/api/saveUserInfo', {
  //     method: 'POST',
  //     body: formData,
  // })
  // .then(response => response.json())
  // .then(data => {
  //     console.log("Success:", data);
  // })
  // .catch(error => {
  //     console.error("Error:", error);
  // });

  alert("Changes Saved Successfully!");
}


function showVehicleDetailsPage() {
  window.location.href = "vehicledetails2.html";
}

function showChangePasswordPage() {
  window.location.href = "changepassword3.html";
}

// Function to handle logout
function showLogout() {
  const username = localStorage.getItem('loggedInUser'); // Get the logged-in user's name
  
  // if (username) {
  //     // Clear the user's reservations from localStorage
  //     localStorage.removeItem(`reservations_${username}`);
  // }

  // Clear user-related data
  selectedArea = '';
  selectedSlot = '';
  previousSlot = null;

  // Reset local reservations variable (in case you use it elsewhere)
  reservations = [];

  // Remove the logged-in user from localStorage
  localStorage.removeItem('loggedInUser');

  // Redirect to login page
  showLoginPage();
}