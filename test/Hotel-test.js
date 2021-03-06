import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/Hotel.js'
import bookingData from '../test-data/Booking-test-data.js';
import roomData from '../test-data/Room-test-data.js';


describe('Hotel', function () {
  let hotel;
  beforeEach(function() {
  hotel = new Hotel('2021/04/22'); 
  }); 
  it('should be a function', function () {
    expect(Hotel).to.be.a('function');
  });
  it('should be an instance of hotel', function() {
    expect(hotel).to.be.instanceof(Hotel); 
  });
  it('should hold a currentDate', function() {
    expect(hotel.date).to.equal('2021/04/22')
  });
  it('should hold a default list of rooms and bookings', function () {
    expect(hotel.rooms).to.deep.equal([]);
    expect(hotel.bookings).to.deep.equal([]);
  });
});