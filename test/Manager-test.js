import chai from 'chai';
const expect = chai.expect;
import Manager from '../src/Manager.js'
import User from '../src/User.js'
import bookingData from '../test-data/Booking-test-data.js';
import userData from '../test-data/User-test-data.js'

describe("Manager", function () {
  let manager1;
  beforeEach(function () {
   manager1 = new Manager(userData); 
  });
  it('should be a function', function () {
    expect(Manager).to.be.a('function'); 
  });
  it('should be an instance of Manager', function () {
    expect(manager1).to.be.an.instanceof(Manager); 
  });
  it('should have a default selected user', function () {
    expect(manager1.selectedUser).to.equal('');
  });
  it('should hold a list of all user\'s', function () {
    expect(manager1.users).to.deep.equal([{
      "id": 1,
      "name": "Leatha Ullrich"
    },
    {
      "id": 2,
      "name": "Rocio Schuster"
    },
    {
      "id": 3,
      "name": "Kelvin Schiller"
    }]);
  });
  it('should search user user\'s and return the user', function () {
    manager1.searchUsers('Rocio');
    expect(manager1.selectedUser).to.be.instanceof(User);
    expect(manager1.selectedUser).to.deep.equal({
      "id": 2,
      "name": "Rocio Schuster",
      "bookings": []
    });
  });
  it('should search users and return an empty string if no user is found', function () {
    manager1.searchUsers('Brittany');
    expect(manager1.selectedUser).to.equal(''); 
  });
  it('should delete a booking for that user', function () {
    manager1.searchUsers('Rocio');
    manager1.selectedUser.updateBookingHistory(bookingData); 
    manager1.deleteBooking("5fwrgu4i7k55hl6t6");

    expect(manager1.selectedUser.bookings.length).to.equal(2);
    expect(manager1.selectedUser.bookings).to.deep.equal( [{
      "id": "5fwrgu4i7k55hl6t7",
      "userID": 2,
      "date": "2020/02/05",
      "roomNumber": 6,
      "roomServiceCharges": []
    },
    {
      "id": "5fwrgu4i7k55hl6u4",
      "userID": 2,
      "date": "2020/01/23",
      "roomNumber": 1,
      "roomServiceCharges": []
    }]);
  });
  it('should create a new booking', function () {
    manager1.searchUsers('Rocio');
    const newBooking = manager1.createNewBooking(4, '2020/02/06');
    expect(newBooking).to.deep.equal(
      {
        userID: 2,
        date: '2020/02/06',
        roomNumber: 4,
      });
  });
});