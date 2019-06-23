const rp = require('request-promise');

const colors = require('./constants/colors');
const {
  aisleCellText,
  beautifyValue,
  centerText,
  windowCellText,
} = require('./lib/utils');

const CELL_LENGTH = 13;
const WINDOW_SPAN = 7;

const reduceHeaderColsToText = (acc, col, index, columns) => {
  let str;
  switch (true) {
    case col.windowSeat: {
      const side = index === 0 ? 'left' : 'right';
      str = `${acc}${windowCellText(col.index, side, true)}`;
      break;
    }
    case col.aisleSeat: {
      const side = columns[index - 1].aisleSeat ? 'left' : 'right';
      str = `${acc}${aisleCellText(col.index, side)}`;
      break;
    }
    default:
      str = `${acc}|${centerText(col.index, CELL_LENGTH)}|`;
      break;
  }
  return str;
};

const reduceRowToText = (ac, seat, index, seats) => {
  const {
    characteristics: {
      AISLE_SEAT: aisleSeat = false,
      WINDOW: windowSeat = false,
      BLOCKED_SEAT: blockedSeat = false,
    } = {},
  } = seat;
  const value = !blockedSeat ? seat.price : 'X';
  let text;
  switch (true) {
    case windowSeat: {
      const side = index === 0 ? 'left' : 'right';
      const beautyText = beautifyValue(
        windowCellText(value, side, false),
        seat.characteristics
      );
      text = `${ac}${beautyText}`;
      break;
    }
    case aisleSeat: {
      const side = seats[index - 1].characteristics.AISLE_SEAT ? 'left' : 'right';
      const beautyText = beautifyValue(aisleCellText(value, side), seat.characteristics);
      text = `${ac}${beautyText}`;
      break;
    }
    default: {
      const beautyText = beautifyValue(centerText(value, CELL_LENGTH), seat.characteristics);
      text = `${ac}|${beautyText}|`;
      break;
    }
  }
  return text;
};

const reduceAllRowsToText = (acc, row) => {
  let str = centerText(row.rowNumber.toString(), WINDOW_SPAN);
  const { seats } = row;
  const textRow = seats.reduce(reduceRowToText, '');
  str += `${textRow}${str}\n`;
  return acc + str;
};

const generateSeatMap = (data) => {
  const {
    aircraft: {
      deck: {
        cabin: {
          columns,
          rows,
        } = {},
      } = {},
    } = {},
  } = data;

  const textCols = columns.reduce(reduceHeaderColsToText, '');
  const headerText = `${colors.BG_HEADER}${colors.FG_HEADER}${textCols}${colors.DEFAULT}${colors.BG_DEFAULT}`;

  const textRows = rows.reduce(reduceAllRowsToText, '');

  return `${headerText}\n${textRows}`;
};

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
