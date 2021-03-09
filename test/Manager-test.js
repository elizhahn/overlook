import chai from 'chai';
const expect = chai.expect;
import User from '../src/User.js'
import bookingData from '../test-data/Booking-test-data.js';
import roomData from '../test-data/Room-test-data.js';

describe("Manager", function () {
  beforeEach(function() {
    let user1, user2, userData1, userData2, manager1, manager2;  
  beforeEach(function () {

   userData1 = {
      "id": 1,
      "name": "Elizabeth Hahn"
      };
   userData2 = {
      "id": 2,
      "name": "Rocio Schuster"
      };
   
   user1 = new User(userData1);
   user2 = new User(userData2); 
   manager1 = new Manager(userData1); 
   manager2 = new Manager(userData2); 
  })

  it('should add a new booking to the user\'s bookings', function () {
    user1.updateBookingHistory(bookingData); 
    const newBooking = user1.createNewBooking(4, '2020/02/06');
    expect(newBooking).to.deep.equal(
      {
        userID: 1,
        date: '2020/02/06',
        roomNumber: 4,
        roomServiceCharges: []
      });
  });
});