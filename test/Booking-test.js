import chai from 'chai';
const expect = chai.expect;
import Booking from '../src/Booking.js'
import bookingData from '../test-data/Booking-test-data.js';


describe('Booking', function () {
  let booking;
  beforeEach(function () {
    booking = new Booking (bookingData[0]); 
  });
  it('should be a function', function () {
    expect(Booking).to.be.a('function');
  });
  it('should be an instance of Room', function () {
    expect(booking).to.be.instanceof(Booking);
  });
  it('should have an id, userID, date, and room number', function () {
    expect(booking.id).to.equal("5fwrgu4i7k55hl6sz");
    expect(booking.userID).to.equal(1); 
    expect(booking.date).to.equal("2020/02/05");
    expect(booking.roomNumber).to.equal(2);
  });
  it('should have a default room service charge', function() {
    expect(booking.roomServiceCharges).to.deep.equal([]); 
  })
});

