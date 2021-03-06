import './css/base.scss';
import './images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg'
import './images/favpng_tidelands-caribbean-hotel-hotel-monte-carlo-suites-resort.png'
import './images/paul-postema-vn30_b1ik6s-unsplash.jpg'
import './images/venice-hotel-tqwvsyL2Kd0-unsplash.jpg' 
import User from './User';
import Hotel from './Hotel';

const apiData = [fetch('http://localhost:3001/api/v1/customers/1'), fetch('http://localhost:3001/api/v1/rooms'), fetch('http://localhost:3001/api/v1/bookings')]

Promise.all(apiData)
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userData, roomData, bookingData] = data;
    initialize(userData, roomData.rooms, bookingData.bookings);
  });

const calendar = document.getElementById('dateSelector'); 
const totalStays = document.getElementById('numberStays');
const totalSpent = document.getElementById('totalSpent');
const userHistory = document.getElementById('userHistory');
const userName = document.getElementById('userName'); 
const btnSearchRooms = document.getElementById('searchRooms');
const availableRoomsList = document.getElementById('roomList')
let currentUser;
let hotel;  

btnSearchRooms.addEventListener('click', displayAvailableRooms); 


  function createUser(userData, bookingData) {
   currentUser = new User(userData);
   currentUser.updateBookingHistory(bookingData);
  }

  function displayUserName() {
    userName.innerText = currentUser.name; 
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
    });
  }

  function findPicture(room) {
    switch(true) {
      case room.roomType === 'junior suite':
        return `<img class="room-img" src="./images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg" alt="sunny hotel room featuring a queen bed"></img>`
      case room.roomType === 'suite':
        return `<img class="room-img" src="./images/favpng_tidelands-caribbean-hotel-hotel-monte-carlo-suites-resort.png" alt="posh hotel room with large windows and a queen bed"></img>` 
      case room.roomType === 'residential suite':
        return `<img class="room-img" src="./images/venice-hotel-tqwvsyL2Kd0-unsplash.jpg" alt="fancy hotel room with double queen beds and marble floors"></img>`
      case room.roomType === 'single room':
        return `<img class="room-img" src="./images/paul-postema-vn30_b1ik6s-unsplash.jpg" alt="cozy hotel room with a king sized bed"></img>`
    } 
  }

  function displayAvailableRooms(date) {
    hotel.checkAvailability(date);
    hotel.availableRooms.forEach(room => {
    const roomPicture = findPicture(room); 
    console.log(roomPicture); 
    availableRoomsList.innerHTML += ` <li class="dashboard-room-item">
    <article class="dashboard-room">
      ${roomPicture}
      <div class="room-info">
        <p class="room-description">room: ${room.roomType}</p>
        <p class="room-description">${room.bidet ? 'bidet' : ''}</p>
        <p class="room-description">bedsize: ${room.bedSize} King</p>
        <p class="room-description">number of beds: ${room.numBeds}</p>
        <p class="room-description">nightly rate: ${room.costPerNight}</p>
      </div>
    </article>
    <div>
      <button class="btn">Book Now</button>
    </div>
   </li>`
    })
  }


// ------------------Where all the magic happens-------------------
  function initialize(userData, roomData, bookingData) {

    const date = '3/11/2021'
    hotel = new Hotel(date, roomData, bookingData); 

    createUser(userData, bookingData); 
    displayAvailableRooms(hotel.date); 
    displayUserTotals(roomData); 
    displayUserHistory();
    displayUserName();   
  } 
