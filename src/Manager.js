import User from "./User";

class Manager  {
  constructor(userData) {
    this.selectedUser = '';
    this.users = userData; 
  }

  searchUsers(name) { 
    const selectedUser = this.users.find(user => {
      const firstandLastName = user.name.toLowerCase().split(' ');
      return firstandLastName.includes(name.toLowerCase());
    });
    
    if (!selectedUser) {
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
}


export default Manager; 
