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
   
  // addBooking() {
  //   method that will add a new booking to the bookings array when called
  // }


}



/*bookings Data: 
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

export default User; 