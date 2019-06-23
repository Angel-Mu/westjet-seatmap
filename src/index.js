const rp = require('request-promise');

const CELL_LENGTH = 13;
const WINDOW_SPAN = 7;
const AISLE_SPAN = 7;

const colors = {
  PREFERRED_SEAT: '\x1b[32m',
  EXIT_ROW_SEAT: '\x1b[34m',
  BLOCKED_SEAT: '\x1b[31m',
  REGULAR_SEAT: '\x1b[36m',
  DEFAULT: '\x1b[0m',
  BG_HEADER: '\x1b[45m',
  FG_HEADER: '\x1b[30m',
  BG_DEFAULT: '\x1b[40m',
};

const centerText = (value, max) => {
  const { length } = value;
  const missing = max - length;
  const floor = Math.floor(missing / 2);
  return value.padStart(max - floor, ' ').padEnd(max, ' ');
};

const windowCellText = (value, side, fill) => {
  const str = centerText(value, CELL_LENGTH);
  const blank = !fill ? '' : ''.padEnd(WINDOW_SPAN, ' ');
  return side === 'left' ? `${blank}]${str}` : `${str}[${blank}`;
};

const aisleCellText = (value, side) => {
  const str = centerText(value, CELL_LENGTH);
  const blank = ''.padEnd(AISLE_SPAN, ' ');
  return side === 'left' ? `${blank}+${str}` : `${str}+${blank}`;
};

const beautifyValue = (value, characteristics = { }) => {
  const {
    BLOCKED_SEAT: blockedSeat = false,
    PREFERRED_SEAT: preferredSeat = false,
    EXIT_ROW_SEAT: exitRow = false,
  } = characteristics;
  const { DEFAULT } = colors;
  let seatColor;

  switch (true) {
    case blockedSeat: {
      seatColor = colors.BLOCKED_SEAT;
      break;
    }
    case preferredSeat: {
      seatColor = colors.PREFERRED_SEAT;
      break;
    }
    case exitRow: {
      seatColor = colors.EXIT_ROW_SEAT;
      break;
    }
    default: {
      seatColor = colors.REGULAR_SEAT;
      break;
    }
  }
  return `${seatColor}${value}${DEFAULT}`;
};

const printSeatMap = (data) => {
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

  const textCols = columns.reduce((acc, col, index) => {
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
  }, '');
  const headerText = `${colors.BG_HEADER}${colors.FG_HEADER}${textCols}${colors.DEFAULT}${colors.BG_DEFAULT}`;

  const textRows = rows.reduce((acc, row) => {
    let str = centerText(row.rowNumber.toString(), WINDOW_SPAN);
    const { seats } = row;
    const textRow = seats.reduce((ac, seat, index) => {
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
          const beautyText = beautifyValue(windowCellText(value, side, false), seat.characteristics);
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
    }, '');
    str += `${textRow}${str}\n`;
    return acc + str;
  }, '');

  console.log(headerText);
  console.log(textRows);
};

const init = () => {
  const opt = {
    uri: 'https://apiw.westjet.com/bookingservices/seatmap?segment=1&flightInfo=%5B%7B%22flight%22%3A%5B%7B%22fareClass%22%3A%22E%22%2C%22flightNumber%22%3A%221508%22%2C%22airlineCodeOperating%22%3A%22WS%22%2C%22operatingFlightNumber%22%3A%221508%22%2C%22airlineCodeMarketing%22%3A%22WS%22%2C%22departureDateTime%22%3A%222019-07-26T10%3A30%3A00%22%2C%22arrivalDateTime%22%3A%222019-07-26T12%3A26%3A00%22%2C%22arrival%22%3A%22SFO%22%2C%22departure%22%3A%22YYC%22%7D%5D%7D%5D&pointOfSale=QkFC',
    method: 'GET',
    json: true,
  };

  rp(opt)
    .then((response) => {
      console.log('Got Successful Response');
      printSeatMap(response);
    })
    .catch((error) => {
      console.log('Got an ERROR!');
      console.log(error);
    });
};

init();
