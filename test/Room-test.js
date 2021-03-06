import chai from 'chai';
const expect = chai.expect;
import Room from '../src/Room.js'
import roomData from '../test-data/Room-test-data.js';

describe('Room', function () {
  let room;
  beforeEach(function () {
    room = new Room (roomData[0]); 
  });
  it('should be a function', function () {
    expect(Room).to.be.a('function');
  });
  it('should be an instance of Room', function () {
    expect(room).to.be.instanceof(Room);
  });
  it('should have a number, roomType, bidet information, bed size, number of beds, and cost', function () {
    expect(room.number).to.equal(1);
    expect(room.roomType).to.equal('residential suite'); 
    expect(room.bidet).to.equal(true);
    expect(room.bedSize).to.equal('queen');
    expect(room.numBeds).to.equal(1); 
    expect(room.costPerNight).to.equal(358.4); 
  })
});
