import './css/base.scss';
import './images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg'
import './images/favpng_tidelands-caribbean-hotel-hotel-monte-carlo-suites-resort.png'
import './images/paul-postema-vn30_b1ik6s-unsplash.jpg'
import './images/venice-hotel-tqwvsyL2Kd0-unsplash.jpg' 
import User from './User';
import Hotel from './Hotel';
import Manager from './Manager';
 

const userHistory = document.getElementById('userHistory');
const userName = document.getElementById('userName'); 
const availableRoomsList = document.getElementById('roomList')
const calendar = document.querySelector('.date-selector');
const calendarManager = document.querySelector('.manager-date-selector');
const roomTypeSection = document.getElementById('roomTypes');
const roomList = document.getElementById('roomList'); 
const managerRoomList = document.getElementById('managerRoomList')
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const userDashboard = document.getElementById('userDashboard');
const managerDashboard = document.getElementById('managerDashboard')
const dashboard = document.getElementById('dashboard');
const btnSearchRooms = document.getElementById('searchRooms');
const btnLogin = document.getElementById('loginBtn');
const btnManagerLogin = document.getElementById('managerLoginBtn');
const btnManagerSearchRooms = document.getElementById('managerSearchRooms');
const btnManagerSearchGuests = document.getElementById('managerSearchGuests');
const snapshot = document.querySelectorAll('.snapshot-total') 
const inputUserName = document.getElementById('user');
const inputPassword = document.getElementById('password');
const userNameErrorMsg = document.getElementById('usernameErrorMsg');
const passwordErrorMsg = document.getElementById('passwordErrorMsg');
const serverErrorMsg = document.getElementById('serverMsg');
const pageErrorMsg = document.getElementById('pageErrorMsg')
const selectedUserErrorMsg = document.getElementById('findGuestErrorMsg');
const managerBookingMsg = document.getElementById('managerBookingMsg');
const apology = document.getElementById('dashboardMsg');
let currentUser;
let manager;
let hotel; 

window.addEventListener('load', loadHotelData); 
btnSearchRooms.addEventListener('click', filterRoomsByDate);
btnManagerSearchRooms.addEventListener('click', filterRoomsByDate);
btnManagerSearchGuests.addEventListener('click', searchGuests);
btnLogin.addEventListener('click', validateUser);
btnManagerLogin.addEventListener('click', validateManager);
roomTypeSection.addEventListener('click', filterRoomsByType);
roomList.addEventListener('click', findBookingInfo);
managerRoomList.addEventListener('click', findBookingInfo);
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
} else if(event.target.id === 'manualCheckin') {
    calendarManager.setAttribute('aria-expanded', 'true');
} else {
    calendar.setAttribute('aria-expanded', 'false'); 
} 
}

function updateCalendar(date) {
  // managerCalendar.setAttribute('min', date.replaceAll('/', '-'));
  // managerCalendar.setAttribute('value', date.replaceAll('/', '-'));
  calendar.setAttribute('min', date.replaceAll('/', '-'));
  calendar.setAttribute('value', date.replaceAll('/', '-')); 
}

function loadHotelData() {
const apiData = [fetch('http://localhost:3001/api/v1/customers/'), fetch('http://localhost:3001/api/v1/rooms'), fetch('http://localhost:3001/api/v1/bookings')]
Promise.all(apiData)
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
    const [userData, roomData, bookingData] = data;
    initialize(userData.customers, roomData.rooms, bookingData.bookings);
  })
  .catch(err => displayPageLoadError())
}

function initialize(userData, roomData, bookingData) {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '/');
  updateCalendar(date); 
  hotel = new Hotel(date, roomData, bookingData); 
  manager = new Manager(userData);
  hotel.checkAvailability(hotel.date); 
  displayAvailableRooms(hotel.availableRooms); 
  
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

function validateManager(event) {
  event.preventDefault();
  const managerUserName = inputUserName.value.match(/manager/g)
  if(managerUserName === null) {
    userNameErrorMsg.innerText = "invalid username, please try again"
} else if(inputPassword.value !== "overlook2021") {
    hide(usernameErrorMsg);
    passwordErrorMsg.innerText = "invalid password, please try again" 
} else {
    hide(passwordErrorMsg)
    managerLogin();
}
}

function findUser(id) {
  fetch(`http://localhost:3001/api/v1/customers/${id[0]}`)
  .then(response => checkForLoginError(response))
  .then(data => {
      userLogin(data, hotel.bookings);
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

function managerLogin() {
  hide(loginPage);
  show(dashboard);
  show(managerDashboard);
  updateSnapshot();
  displayRoomsManagerView(); 
}
 
function updateSnapshot() {
  const revenue = hotel.calcTodayRevenue(hotel.date);
  const percent = hotel.calcPercentOccupied();
  const snapshotData = [hotel.availableRooms.length, revenue, percent]
  snapshot.forEach((item, i) => {
    item.innerText = snapshotData[i];
  });
}

function displayRoomsManagerView () {
  managerRoomList.innerHTML = '';
  hotel.availableRooms.forEach(room => {
    managerRoomList.innerHTML += `  <li class="manager-room-item">
    <p>${room.roomType}</p>
    <p>${room.number}</p>
    <p>$${room.costPerNight}</p>
    <button class="btn book-guest-btn" id="bookGuest${room.number}">Book Guest</button>
  </li>`
  });
}

function searchGuests() {
  const inputSearchGuests = document.getElementById('searchGuests'); 
  manager.searchUsers(inputSearchGuests.value);
  const selectedUser = manager.selectedUser;
  if(selectedUser === ''){
    selectedUserErrorMsg.innerText = 'Guest record not found'
} else {
  hide(selectedUserErrorMsg); 
  selectedUser.updateBookingHistory(hotel.bookings);
  const userTotalSpent = selectedUser.calcTotalSpent(hotel.rooms);
  displaySelectedUserHistory(manager.selectedUser.bookings, userTotalSpent); 
}
}

function displaySelectedUserHistory(userBookings, userSpent) {
  const selectedUserHistory = document.getElementById('selectedUserList');
  const totalSpentSelectedGuest = document.getElementById('selectedGuestTotalSpent');
  totalSpentSelectedGuest.innerText = userSpent;
  selectedUserHistory.innerHTML = '';
  userBookings.forEach(booking => {
    const bookedRoom = hotel.returnRoomInfo(booking.roomNumber);
    selectedUserHistory.innerHTML += ` <li class="selected-user-room-item">
    <p>${booking.date}</p>
    <p>${bookedRoom.roomType}</p>
    <p>${bookedRoom.number}</p>
    <input class="selected-user-checkbox" aria-label="delete-checkbox" type="checkbox" id="box${bookedRoom.number}" name="delete-booking">
    </li> `
  }); 
}

function userLogin(userData, bookingData) {
  hide(loginPage);
  show(dashboard); 
  show(userDashboard); 
  currentUser = new User(userData); 
  currentUser.updateBookingHistory(bookingData); 
  //move displayAvailable rooms here?
  displayUserInfo(); 
}

function displayUserInfo() {
  const totalStays = document.getElementById('numberStays');
  const totalSpent = document.getElementById('totalSpent');
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

function displayAvailableRooms(roomList) {
  availableRoomsList.innerHTML = '';
  roomList.forEach(room => {
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

function filterRoomsByDate(event) {
  let date;
  if(event.target.id === 'searchRooms'){
    date = calendar.value.replaceAll("-", "/")
    userSearchDisplay(date);
} else if(event.target.id === 'managerSearchRooms') {
    date = calendarManager.value.replaceAll("-", "/")
    managerSearchDisplay(date)
}
}

function userSearchDisplay(date) {
  hotel.checkAvailability(date)
  if(hotel.availableRooms.length) { 
    hide(apology); 
    displayAvailableRooms(hotel.availableRooms); 
} else {
    displayAvailableRooms(hotel.availableRooms);
    show(apology);
}  
}

function managerSearchDisplay(date) {
  hotel.checkAvailability(date);
  displayRoomsManagerView();   
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
  const date = calendar.value.replaceAll("-", "/");
  hotel.checkAvailability(date); 
  const filteredRooms = hotel.filterRooms(roomType);
  if(filteredRooms.length) {
    hide(apology); 
    displayAvailableRooms(filteredRooms);
} else {
    displayAvailableRooms(filteredRooms); 
    show(apology); 
}
}

function findBookingInfo(event) { 
  let roomNumber, room;
  const clickedButton = event.target
  if(event.target.classList.contains('book-btn')) {
    roomNumber = Number(event.target.parentNode.id.replace("room", ''))
    room = hotel.returnRoomInfo(roomNumber);
    bookRoom(room, clickedButton);
} else if(event.target.classList.contains('book-guest-btn')) {
    roomNumber = Number(event.target.id.replace("bookGuest", ''))
    room = hotel.returnRoomInfo(roomNumber);
    managerBookRoom(room, clickedButton);
}
}

function managerBookRoom(roomInfo, button) {
  fetch(`http://localhost:3001/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'userID': manager.selectedUser.id, 'date': calendarManager.value.replaceAll('-', '/'), 'roomNumber': roomInfo.number})
  })
    .then(response => managerCheckForError(response))
    .then(booking => {  
      button.disabled = true;
      hotel.addNewBooking(booking.newBooking);
      const userTotalSpent = manager.selectedUser.calcTotalSpent(hotel.rooms);
      manager.selectedUser.updateBookingHistory(hotel.bookings); 
      displaySelectedUserHistory(manager.selectedUser.bookings, userTotalSpent);
    })
    .catch(err => console.log(err.message));
}


function managerCheckForError (response) { 
  if (!response.ok) { 
    managerBookingMsg.innerText = "Something went wrong on our end, please try back later"
  } else {
    managerBookingMsg.innerText = "Booking confirmed";
    return response.json(); 
  }
}

function managerServerMessage() {
  managerBookingMsg.innerText = "Something went wrong on our end, please try back later"
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


