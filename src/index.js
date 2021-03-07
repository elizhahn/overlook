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

 
const totalStays = document.getElementById('numberStays');
const totalSpent = document.getElementById('totalSpent');
const userHistory = document.getElementById('userHistory');
const userName = document.getElementById('userName'); 
const btnSearchRooms = document.getElementById('searchRooms');
const availableRoomsList = document.getElementById('roomList')
const calendar = document.querySelector('.date-selector')
const roomTypeSection = document.getElementById('roomTypes');
const roomList = document.getElementById('roomList'); 
let currentUser;
let hotel; 

btnSearchRooms.addEventListener('click', filterRoomsByDate);
roomTypeSection.addEventListener('click', filterRoomsByType);
roomList.addEventListener('click', findBookingInfo);

  function createUser(userData, bookingData) {
   currentUser = new User(userData);
   currentUser.updateBookingHistory(bookingData);
  }

  function displayUserInfo(roomData) {
    userName.innerText = currentUser.name; 
    totalStays.innerText = currentUser.calcNumberStays();
    totalSpent.innerText = `$${currentUser.calcTotalSpent(roomData)}`
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

  function displayAvailableRooms() {
    availableRoomsList.innerHTML = '';
    hotel.availableRooms.forEach(room => {
    const roomPicture = findPicture(room); 
    availableRoomsList.innerHTML += ` <li class="dashboard-room-item">
    <article class="dashboard-room">
      ${roomPicture}
      <div class="room-info">
        <p class="room-description">room: ${room.roomType}</p>
        <p class="room-description">${room.bidet ? 'bidet' : ''}</p>
        <p class="room-description">bedsize: ${room.bedSize} King</p>
        <p class="room-description">number of beds: ${room.numBeds}</p>
        <p class="room-description">nightly rate: $${room.costPerNight}</p>
      </div>
    </article>
    <div id="room${room.number}">
      <button class="btn book-btn">Book Now</button>
      <p class="bookingMsg"></p>
    </div>
   </li>`
    });
  }

  function displayFilteredRooms(roomType) {
    availableRoomsList.innerHTML = '';
    const filteredRooms = hotel.filterRooms(roomType);
    filteredRooms.forEach(room => {
    const roomPicture = findPicture(room); 
    availableRoomsList.innerHTML += ` <li class="dashboard-room-item">
    <article class="dashboard-room">
      ${roomPicture}
      <div class="room-info">
        <p class="room-description">room: ${room.roomType}</p>
        <p class="room-description">${room.bidet ? 'bidet' : ''}</p>
        <p class="room-description">bedsize: ${room.bedSize} King</p>
        <p class="room-description">number of beds: ${room.numBeds}</p>
        <p class="room-description">nightly rate: $${room.costPerNight}</p>
      </div>
    </article>
    <div id="room${room.number}">
      <button class="btn book-btn">Book Now</button>
      <p class="bookingMsg"></p>
    </div>
   </li>`
    });

  }

  function filterRoomsByDate() {
    const date = calendar.value.replaceAll("-", "/")
    hotel.checkAvailability(date);
    displayAvailableRooms(); 
  }

  function filterRoomsByType(event) {
    let filter; 
    if(event.target.id === 'suite') {
      filter = 'suite'
  } else if(event.target.id === 'juniorSuite') {
      filter = 'junior suite'
  } else if(event.target.id === 'residentialSuite') {
      filter = 'residential suite'
  }  else {
      filter = 'single room'
    }
    displayFilteredRooms(filter);   
  }

  function findBookingInfo(event) { 
    let roomNumber; 
    if(event.target.classList.contains('book-btn')) {
       roomNumber = Number(event.target.parentNode.id.replace("room", ''))
    }
     const room = hotel.returnRoomInfo(roomNumber);
     bookRoom(room); 
  }

  function bookRoom(roomInfo) { 
    fetch(`http://localhost:3001/api/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'userID': currentUser.id, 'date': calendar.value.replaceAll('-', '/'), 'roomNumber': roomInfo.number})
    })
      .then(response => checkForError(response, roomInfo))
      .catch(err => displayErrorMessage(roomInfo))
  }

  function checkForError (response, roomInfo) {
    if (!response.ok) { 
      displayErrorMessage(roomInfo);
    } else {
      displaySuccessMsg(roomInfo)
      return response.json(); 
    }
  }

  function displayErrorMessage(roomInfo) {
    const msgBooking = document.querySelectorAll('.bookingMsg')
    msgBooking.forEach(msg => {
      if(msg.parentNode.id === `room${roomInfo.number}`) {
        msg.innerText = 'Something went wrong please refresh and try again'
      }
    });
  }
  

  function displaySuccessMsg (roomInfo) {
    const msgBooking = document.querySelectorAll('.bookingMsg')
    msgBooking.forEach(msg => {
      if(msg.parentNode.id === `room${roomInfo.number}`) {
        msg.innerText = 'You\'re all set! Booking confirmed.'
      }
    });
  }




// ------------------Where all the magic happens-------------------
  function initialize(userData, roomData, bookingData) {
   
    const date = '2020/04/22'
    hotel = new Hotel(date, roomData, bookingData); 
    createUser(userData, bookingData);  
    displayUserInfo(roomData); 
    hotel.checkAvailability(hotel.date); 
    displayAvailableRooms();
       
  } 
