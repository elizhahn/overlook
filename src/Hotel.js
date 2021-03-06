/* 
class Hotel {
  constructor() {
    this.rooms = [array holds all Room instances]
    this.bookings = [array holds all bookings]
  }

  filterRooms("roomType") {
    method that will take in a roomType parameter
    (suite, residiential suite, junior suite..etc); 
    return an array of room objects of that type
  }

  checkAvailability(date) {
    method that will return a list of rooms based on a chosen date from the customer
    should return an array of rooms
  }
}


bookings Data: 
{
    "id": "5fwrgu4i7k55hl6t5", unique id for booking
    "userID": 43, who booked
    "date": "2020/01/24",
    "roomNumber": 24,
    "roomServiceCharges": []
  }
customer Data: 
  {
    "id": 1,
    "name": "Leatha Ullrich"
  }
Rooms Data: 
  {
    "number": 25,
    "roomType": "single room",
    "bidet": true,
    "bedSize": "queen",
    "numBeds": 1,
    "costPerNight": 305.85
  }

*/