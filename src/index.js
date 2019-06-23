const rp = require('request-promise');

const generateSeatMap = require('./generate-seatmap');

const handler = () => {
  const opt = {
    uri: 'https://apiw.westjet.com/bookingservices/seatmap?segment=1&flightInfo=%5B%7B%22flight%22%3A%5B%7B%22fareClass%22%3A%22E%22%2C%22flightNumber%22%3A%221508%22%2C%22airlineCodeOperating%22%3A%22WS%22%2C%22operatingFlightNumber%22%3A%221508%22%2C%22airlineCodeMarketing%22%3A%22WS%22%2C%22departureDateTime%22%3A%222019-07-26T10%3A30%3A00%22%2C%22arrivalDateTime%22%3A%222019-07-26T12%3A26%3A00%22%2C%22arrival%22%3A%22SFO%22%2C%22departure%22%3A%22YYC%22%7D%5D%7D%5D&pointOfSale=QkFC',
    method: 'GET',
    json: true,
  };

  rp(opt)
    .then((response) => {
      console.log('Got successful response');
      return generateSeatMap(response);
    })
    .then(console.log)
    .catch((error) => {
      console.log('An ERROR has ocurred');
      console.log(error);
    });
};

exports.handler = handler;

handler();
