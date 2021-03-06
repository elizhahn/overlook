// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';
import Hotel from './Hotel';


// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg'
import User from './User';


const totalStays = document.getElementById('numberStays');
const totalSpent = document.getElementById('totalSpent');
const userHistory = document.getElementById('userHistory');
let currentUser;
let hotel;  

const apiData = [fetch('http://localhost:3001/api/v1/customers/1'), fetch('http://localhost:3001/api/v1/rooms'), fetch('http://localhost:3001/api/v1/bookings')]

Promise.all(apiData)
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userData, roomData, bookingData] = data;
    initialize(userData, roomData.rooms, bookingData.bookings);
  });

  function createUser(userData, bookingData) {
   currentUser = new User(userData);
   currentUser.updateBookingHistory(bookingData);
  }

  function displayUserTotals(roomData) {
      totalStays.innerText = currentUser.calcNumberStays();
      totalSpent.innerText = currentUser.calcTotalSpent(roomData)
  }

  function displayUserHistory() {
    currentUser.bookings.forEach(booking => {
      const bookedRoom = hotel.returnRoomInfo(booking.roomNumber); 
      userHistory.innerHTML += `<li class="dashboard-stays-item">
      <p>${booking.date}</p>
      <p>${bookedRoom.roomType}</p>
  </li>`
    })
    
  }

// ------------------Where all the magic happens-------------------
  function initialize(userData, roomData, bookingData) {
  
    const date = '3/11/2021'
    hotel = new Hotel(date, roomData, bookingData); 
     
    createUser(userData, bookingData); 
    displayUserTotals(roomData); 
    displayUserHistory();  
  }