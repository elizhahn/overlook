//Planning User


class User {
  constructor (userData) {
    this.id = userData.id;
    this.password = 'overlook2021';
    this.name = userData.name; 
    this.bookings = []; 
  }

   updateBookingHistory(bookingData) {
    const userBookings = bookingData.filter(booking => {
      return booking.userID === this.id;
    });
    
    userBookings.sort((bookingA, bookingB) => {
      if(bookingA.date > bookingB.date) {
        return -1
    } else if( bookingA.date < bookingB.date) {
        return 1
    } else {
        return 0
    }
    });
    this.bookings = userBookings;
  }

  calcNumberStays() {
    return this.bookings.length; 
  }

  calcTotalSpent(roomData) {
    const customerSpending = this.bookings.reduce((totalSpent, booking) => {
      const bookedRoom = roomData.find(hotelRoom => {
       return booking.roomNumber === hotelRoom.number;  
      });
      totalSpent += bookedRoom.costPerNight;
      return totalSpent; 
    }, 0);
    return Number(customerSpending.toFixed(2)); 
  }
   
  createNewBooking(roomNumber, date) {
      const newBooking = 
      {
        userID: this.id,
        date: date,
        roomNumber: roomNumber,
        roomServiceCharges: []
      };
      return newBooking; 
  }
}



export default User; 