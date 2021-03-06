import chai from 'chai';
import Hotel from '../src/Hotel.js';
const expect = chai.expect;
import User from '../src/User.js'
import bookingData from '../test-data/Booking-test-data.js';
import roomData from '../test-data/Room-test-data.js';

describe('User', function() {
  let user1, user2, userData1, userData2;  
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
    
  });
  it('should be a function', function () {
    expect(User).to.be.a('function'); 
  });
  it('should be an instance of User', function () {
    expect(user1).to.be.instanceof(User); 
  });
  it('should hold a user\'s name and id', function (){
    expect(user1.id).to.equal(1);
    expect(user1.name).to.equal("Elizabeth Hahn")
  })
  it('should have a default password and bookings history', function () {
    expect(user1.password).to.equal('overlook2021');
    expect(user1.bookings).to.deep.equal([]);
  })
  it('should update a user\'s booking history', function() {
    user1.updateBookingHistory(bookingData); 
     
    expect(user1.bookings.length).to.equal(2);
    expect(user1.bookings).to.deep.equal([{
      "id": "5fwrgu4i7k55hl6sz",
      "userID": 1,
      "date": "2020/02/05",
      "roomNumber": 2,
      "roomServiceCharges": []
    },
    {
      "id": "5fwrgu4i7k55hl6t5",
      "userID": 1,
      "date": "2020/02/05",
      "roomNumber": 4,
      "roomServiceCharges": []
    }]);  
  });
  it('should update booking history from newest to oldest bookings', function () {
    user2.updateBookingHistory(bookingData); 
    expect(user2.bookings.length).to.equal(3); 
    expect(user2.bookings).to.deep.equal([
    {
      "id": "5fwrgu4i7k55hl6t6",
      "userID": 2,
      "date": "2020/02/05",
      "roomNumber": 5,
      "roomServiceCharges": []
    },
    {
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
  })
  it('should calculate user\'s total amount spent',function () {
    user1.updateBookingHistory(bookingData); 
    const totalSpent = user1.calcTotalSpent(roomData);
    expect(totalSpent).to.equal(906.82); 
  });
});