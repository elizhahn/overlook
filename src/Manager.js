import User from "./User";

class Manager  {
  constructor(userData){
    this.selectedUser = '';
    this.users = userData; 
  }

  searchUsers(name) {
    const selectedUser = this.users.find(user => {
      const firstandLastName = user.name.split(' ');
      return firstandLastName.includes(name);
    });
    if(!selectedUser) {
      this.selectedUser = '';
  } else {
      const user = new User(selectedUser);  
      this.selectedUser = user; 
  }
  }
  deleteBooking(bookingId) {
    const bookingIndex = this.selectedUser.bookings.findIndex(booking => {
      return booking.id === bookingId;
    });
    this.selectedUser.bookings.splice(bookingIndex, 1); 
  }
  
  createNewBooking(roomNum, date) {
    return {
      userID: this.selectedUser.id,
      date: date,
      roomNumber: roomNum
    }
  }
}


export default Manager; 

//Have a manager login button that is clicked and will validate if the manager can sign in or not


   //manager can search a user by name and a current User is intitated
   // manager can use thier name, and bookings array
   //

   //METHODS 

   //Search users
   //method that will search the user's array and find the user match
   // should return user 

    //deleteBooking {
      // method will delete booking from the user's array
      //can access the user's array via inheritance
    //}



//   returnBookings(bookingsData, RoomData) {
//     method to update the customer's bookings array here
//   }

// createNewBooking(roomNumber, date) {
  //     const newBooking = 
  //     {
  //       userID: this.id,
  //       date: date,
  //       roomNumber: roomNumber,
  //       roomServiceCharges: []
  //     };
  //     return newBooking; 
  // }




// }