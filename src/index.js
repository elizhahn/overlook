import './css/base.scss';
import './images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg'
import './images/favpng_tidelands-caribbean-hotel-hotel-monte-carlo-suites-resort.png'
import './images/paul-postema-vn30_b1ik6s-unsplash.jpg'
import './images/venice-hotel-tqwvsyL2Kd0-unsplash.jpg' 
import User from './User';
import Hotel from './Hotel';
 
const totalStays = document.getElementById('numberStays');
const totalSpent = document.getElementById('totalSpent');
const userHistory = document.getElementById('userHistory');
const userName = document.getElementById('userName'); 
const availableRoomsList = document.getElementById('roomList')
const calendar = document.querySelector('.date-selector')
const roomTypeSection = document.getElementById('roomTypes');
const roomList = document.getElementById('roomList'); 
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const dashboard = document.getElementById('dashboard');
const btnSearchRooms = document.getElementById('searchRooms');
const btnLogin = document.getElementById('loginBtn');
const inputUserName = document.getElementById('user');
const inputPassword = document.getElementById('password');
const userNameErrorMsg = document.getElementById('usernameErrorMsg');
const passwordErrorMsg = document.getElementById('passwordErrorMsg');
const serverErrorMsg = document.getElementById('serverMsg');
const pageErrorMsg = document.getElementById('pageErrorMsg')
const apology = document.getElementById('dashboardMsg');
let currentUser;
let hotel; 

window.addEventListener('load', loadHotelData); 
btnSearchRooms.addEventListener('click', filterRoomsByDate);
btnLogin.addEventListener('click', validateUser);
roomTypeSection.addEventListener('click', filterRoomsByType);
roomList.addEventListener('click', findBookingInfo);
mainPage.addEventListener('click', updateAria);

  function hide(element) {
    element.classList.add('hidden'); 
  }

  function show(element) {
    element.classList.remove('hidden'); 
  }

  function updateAria(event) {
    if(event.target.id === 'checkin') {
      calendar.setAttribute('aria-expanded', 'true')
  } else {
      calendar.setAttribute('aria-expanded', 'false'); 
  } 
  }

  function updateCalendar(date) {
    calendar.setAttribute('min', date.replaceAll('/', '-'));
    calendar.setAttribute('value', date.replaceAll('/', '-')); 
  }

  function loadHotelData() {
  const apiData = [fetch('http://localhost:3001/api/v1/customers/1'), fetch('http://localhost:3001/api/v1/rooms'), fetch('http://localhost:3001/api/v1/bookings')]

Promise.all(apiData)
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userData, roomData, bookingData] = data;
    initialize(userData, roomData.rooms, bookingData.bookings);
  })
  .catch(err => displayPageLoadError())
}

function displayPageLoadError() {
  hide(loginPage); 
  hide(mainPage);
  show(pageErrorMsg); 
}

  function validateUser(event) {
   event.preventDefault(); 
   const userName = inputUserName.value.match(/^[A-Z][a-z]{7}\d{1,2}$/i);
   const preFix = inputUserName.value.match(/customer/g)
    if(userName === null || preFix === null) {
      userNameErrorMsg.innerText = "invalid username, please try again"
  } else if(inputPassword.value !== "overlook2021") {
     hide(usernameErrorMsg);
     passwordErrorMsg.innerText = "invalid password, please try again" 
  } else { 
    hide(passwordErrorMsg);
    const userId = inputUserName.value.match(/\d+/g)
    findUser(userId)
  }
  }

  function findUser(id) {
    fetch(`http://localhost:3001/api/v1/customers/${id[0]}`)
    .then(response => checkForLoginError(response))
    .then(data => {
       login(data, hotel.bookings);
    })
    .catch(err => displayLoginServerError())
  }

  function displayLoginServerError() { 
    serverErrorMsg.innerText = "Something went wrong on our end, please try again later"
  }

  function checkForLoginError(response) {
    if(!response.ok) {
      userNameErrorMsg.innerText = "please double check your username ID"
      return Promise.reject(error);
  } else {
     return response.json();    
  }
  }

  function login(userData, bookingData) {
   hide(loginPage);
   show(dashboard); 
   currentUser = new User(userData); 
   currentUser.updateBookingHistory(bookingData); 
   displayUserInfo(); 
  }

  function displayUserInfo() {
    userName.innerText = `Welcome, ${currentUser.name}`; 
    totalStays.innerText = currentUser.calcNumberStays();
    totalSpent.innerText = `$${currentUser.calcTotalSpent(hotel.rooms)}`
    userHistory.innerHTML = ``;
    currentUser.bookings.forEach(booking => {
      const bookedRoom = hotel.returnRoomInfo(booking.roomNumber); 
      userHistory.innerHTML += `<li class="dashboard-stays-item">
      <p>${booking.date}</p>
      <p>${bookedRoom.roomType}</p>
  </li>`
  });
    colorNewBookings(); 
 }

 function colorNewBookings() {
  const bookings = document.querySelectorAll(".dashboard-stays-item");
  bookings.forEach(booking => {
    if(booking.firstChild.nextSibling.innerText >= hotel.date) {
        booking.classList.add('purple'); 
    }
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
    <div class="book-container" id="room${room.number}">
      <button class="btn book-btn" id="btn${room.number}">Book Now</button>
      <p class="bookingMsg"></p>
    </div>
   </li>`
    });
  }

  function displayFilteredRooms(filteredRooms) {
    availableRoomsList.innerHTML = '';
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
    <div class="book-container" id="room${room.number}">
      <button class="btn book-btn">Book Now</button>
      <p class="bookingMsg"></p>
    </div>
   </li>`
    });
  }

  function filterRoomsByDate() {
    const date = calendar.value.replaceAll("-", "/")
    hotel.checkAvailability(date)
    if(hotel.availableRooms.length) { 
      hide(apology); 
      displayAvailableRooms(); 
  } else {
      displayAvailableRooms()
      show(apology);
  }
    
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
    checkFilteredRooms(filter);  
  }

  function checkFilteredRooms(roomType)  {
    const filteredRooms = hotel.filterRooms(roomType);
    if(filteredRooms.length) {
      hide(apology); 
      displayFilteredRooms(filteredRooms);
  } else {
      displayFilteredRooms(filteredRooms); 
      show(apology); 
  }
  }

  function findBookingInfo(event) { 
    let roomNumber; 
    const clickedButton = event.target
    if(event.target.classList.contains('book-btn')) {
       roomNumber = Number(event.target.parentNode.id.replace("room", ''))
    }
     const room = hotel.returnRoomInfo(roomNumber);
     bookRoom(room, clickedButton); 
  }

  function bookRoom(roomInfo, button) { 
    fetch(`http://localhost:3001/api/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'userID': currentUser.id, 'date': calendar.value.replaceAll('-', '/'), 'roomNumber': roomInfo.number})
    })
      .then(response => checkForError(response, roomInfo))
      .then(booking => { 
        button.disabled = true;
        hotel.addNewBooking(booking.newBooking);
        currentUser.updateBookingHistory(hotel.bookings);
        displayUserInfo(); 
      })
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

  function initialize(userData, roomData, bookingData) {
    const date = new Date().toISOString().slice(0, 10).replaceAll('-', '/');
    updateCalendar(date); 
    hotel = new Hotel(date, roomData, bookingData); 
    hotel.checkAvailability(hotel.date); 
    displayAvailableRooms(); 
   
  } 
