
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

  addNewBooking(booking) {
    this.bookings.unshift(booking); 
  }
  
}

export default Hotel; 

