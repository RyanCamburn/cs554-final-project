import { Timestamp } from 'firebase/firestore';

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const logError = (e: unknown, message: string = '') => {
  if (e instanceof Error) {
    console.error(`❌ ${message}`, e.message);
  } else {
    console.error(`❌ ${message}`, e);
  }
};

export const stringToFirebaseTimestamp = (
  inputDate: string | Date | Timestamp,
) => {
  if (inputDate instanceof Date) {
    return Timestamp.fromDate(inputDate);
  } else if (inputDate instanceof Timestamp) {
    return inputDate;
  }
  return Timestamp.fromDate(new Date(inputDate));
};

// Firestore does not return JavaScript Date objects and instead returns a timestamp object
// This helper function converts a Firestore timestamp object to a JavaScript Date object
export const timestampToDate = (timestamp: {
  seconds: number;
  nanoseconds: number;
}) => {
  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
  return new Date(milliseconds);
};

// convert time in 12 hour format to military time
// i.e. 01:00 PM -> 13:00, 12:00 AM -> 00:00
export const timeToMilitary = (time: string) => {
  const [timeStr, modifier] = time.split(' ');

  let hours;
  const [hoursStr, minutes] = timeStr.split(':');
  hours = hoursStr;

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours}:${minutes}`;
};
