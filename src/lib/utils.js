const colors = require('../constants/colors');

const CELL_LENGTH = 13;
const WINDOW_SPAN = 7;
const AISLE_SPAN = 7;

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

const beautifyValue = (value, characteristics = {}) => {
  const {
    BLOCKED_SEAT: blockedSeat = false,
    PREFERRED_SEAT: preferredSeat = false,
    EXIT_ROW_SEAT: exitRow = false,
  } = characteristics;
  const { DEFAULT } = colors;
  let seatColor;

  switch (true) {
    case blockedSeat:
      seatColor = colors.BLOCKED_SEAT;
      break;
    case preferredSeat:
      seatColor = colors.PREFERRED_SEAT;
      break;
    case exitRow:
      seatColor = colors.EXIT_ROW_SEAT;
      break;
    default:
      seatColor = colors.REGULAR_SEAT;
      break;
  }
  return `${seatColor}${value}${DEFAULT}`;
};

module.exports = {
  aisleCellText,
  beautifyValue,
  centerText,
  windowCellText,
};
