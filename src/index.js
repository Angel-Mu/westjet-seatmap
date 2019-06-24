const rp = require('request-promise');

const generateSeatMap = require('./generate-seatmap');

const data = [{
  fareClass: 'A',
  flightNumber: '1508',
  airlineCodeOperating: 'WS',
  operatingFlightNumber: '1508',
  airlineCodeMarketing: 'WS',
  departureDateTime: '2019-07-26T10:30:00',
  arrivalDateTime: '2019-07-26T12:26:00',
  arrival: 'SFO',
  departure: 'YYC',
}];

const handler = () => {
  const encodedFlightInfo = encodeURIComponent(JSON.stringify([{ flight: data }]));
  const opt = {
    uri: `https://apiw.westjet.com/bookingservices/seatmap?flightInfo=${encodedFlightInfo}`,
    method: 'GET',
    qs: {
      segment: 1,
      pointOfSale: 'QkFC',
    },
    json: true,
  };

  rp(opt)
    .then((response) => {
      console.log('Got successful response for:');
      return generateSeatMap(response);
    })
    .then((seatMap) => {
      const [flight] = data;
      Object.keys(flight).forEach((key) => {
        console.log(`${key}\t::\t${flight[key]}`);
      });
      console.log('=========================================================');
      console.log(seatMap);
    })
    .catch((error) => {
      console.log('An ERROR has ocurred');
      console.log(error);
    });
};

exports.handler = handler;

handler();
