import chai from 'chai';
const expect = chai.expect;
import Hotel from '../src/Hotel.js'
import Room from '../src/Room.js';
import Booking from '../src/Booking.js'
import bookingData from '../test-data/Booking-test-data.js';
import roomData from '../test-data/Room-test-data.js';


describe('Hotel', function () {
  let hotel, roomInstances, bookingInstances; 
  beforeEach(function() {
    roomInstances = roomData.map(room => {
     return room = new Room(room); 
   });
    bookingInstances = bookingData.map(booking => {
     return booking = new Booking(booking); 
   });
   hotel = new Hotel('2021/04/22', roomInstances, bookingInstances); 
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
  it('should hold a list of rooms and bookings', function () {
    expect(hotel.rooms.length).to.equal(6);
    expect(hotel.rooms[0]).to.be.instanceof(Room); 
    expect(hotel.bookings.length).to.equal(7);
    expect(hotel.bookings[0]).to.be.instanceof(Booking); 
  });
  it('should have a default empty array of available rooms', function () {
    expect(hotel.availableRooms).to.deep.equal([]); 
  })
  it('should return available rooms for a given date', function() {
    hotel.checkAvailability('2020/02/06')
    expect(hotel.availableRooms).to.deep.equal([{
      "number": 1,
      "roomType": "residential suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 358.4
    },
    {
      "number": 2,
      "roomType": "suite",
      "bidet": false,
      "bedSize": "full",
      "numBeds": 2,
      "costPerNight": 477.38
    },
    {
      "number": 3,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "king",
      "numBeds": 1,
      "costPerNight": 491.14
    },
    {
      "number": 4,
      "roomType": "single room",
      "bidet": false,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 429.44
    },
    {
      "number": 5,
      "roomType": "single room",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 2,
      "costPerNight": 340.17
    },
    {
      "number": 6,
      "roomType": "junior suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 397.02
    }]);
  });
  it('should return an empty array if no available rooms', function () {
    hotel.checkAvailability("2020/02/05")
    expect(hotel.availableRooms).to.deep.equal([]);
  });
  it('should filter rooms by room type', function () {
    hotel.checkAvailability('2020/02/06')
    const filteredRooms = hotel.filterRooms('suite');
    expect(filteredRooms).to.deep.equal([{
      "number": 2,
      "roomType": "suite",
      "bidet": false,
      "bedSize": "full",
      "numBeds": 2,
      "costPerNight": 477.38
    }]);
  });
  it('should return an empty array if no rooms of that type are available', function () {
    hotel.checkAvailability("2020/01/23");
    const filteredRooms = hotel.filterRooms('residential suite');
    expect(filteredRooms).to.deep.equal([]);
  });
  it('should return room information', function () {
    const roomInfo= hotel.returnRoomInfo(1); 
    expect(roomInfo).to.deep.equal({
      "number": 1,
      "roomType": "residential suite",
      "bidet": true,
      "bedSize": "queen",
      "numBeds": 1,
      "costPerNight": 358.4
    })
  })
  it('should add a new booking to the booking list', function () {
    const newBooking = {
      "id": "2fiknu4i7k55h7ygd",
      "userID": 1,
      "date": "2020/02/05",
      "roomNumber": 4,
      "roomServiceCharges": []
    }
    hotel.addNewBooking(newBooking);
    expect(hotel.bookings.length).to.equal(8);
    expect(hotel.bookings[0]).to.deep.equal({
      "id": "2fiknu4i7k55h7ygd",
      "userID": 1,
      "date": "2020/02/05",
      "roomNumber": 4,
      "roomServiceCharges": []
    });
  });
  it('should return daily revenue', function () {
    const todayRevenue = hotel.calcTodayRevenue('2020/02/05')
    expect(todayRevenue).to.equal(2493.55); 
  });
  it('should return daily percentage occupied', function () {
    hotel.checkAvailability('2020/02/05')
    const percent1 = hotel.calcPercentOccupied();
    expect(percent1).to.equal(100);

    hotel.checkAvailability('2020/02/06');
    console.log(hotel.availableRooms) 
    const percent2 = hotel.calcPercentOccupied();
    expect(percent2).to.equal(0);
  })
});