
class Hotel {
  constructor(date, roomData, bookingData) {
    this.date = date; 
    this.rooms = roomData;
    this.bookings = bookingData;
    this.availableRooms = []; 
  }

  filterRooms(roomType) {
    const availableRoomTypes = this.availableRooms.filter(room => {
      return roomType === room.roomType; 
    });
    return availableRoomTypes; 
  }

  checkAvailability(date) { 
    const bookedRooms = this.bookings.filter(booking => {
      return date === booking.date
    }); 
    const roomNumbers = bookedRooms.map(booking => {
      return booking.roomNumber; 
    });
    const availableRooms = this.rooms.filter(room => {
      return !roomNumbers.includes(room.number)
      });
      return this.availableRooms = availableRooms; 
  }

  returnRoomInfo(roomNumber) {
    const room = this.rooms.find(room => {
      return roomNumber === room.number; 
    });
    return room; 
  }
  
}

export default Hotel; 

/*
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