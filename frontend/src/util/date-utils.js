import moment from "moment";

export const extractTimeFromDateString = (dateString) => {
  // Ensure valid Moment.js object
  const parsedDate = moment(dateString, moment.ISO_8601);

  // Check for valid date and time information
  if (!parsedDate.isValid()) {
    throw new Error("Invalid date string format");
  }

  // Extract and format the time
  const timeString = parsedDate.format("h:mm A");

  return timeString;
};

export function extractYearAndMonthAndDateFromDateString(dateString) {
  // Ensure valid Moment.js object
  const parsedDate = moment(dateString, moment.ISO_8601);

  // Check for valid date and time information
  if (!parsedDate.isValid()) {
    throw new Error("Invalid date string format");
  }

  // Extract month and date
  const year = parsedDate.year();
  const month = parsedDate.format("MMM");
  const date = parsedDate.date();
  const day = parsedDate.format("ddd");

  // Return an object with month and date
  return { year, month, date, day };
}

export function convertDateToString(date) {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  return formattedDate;
}

export function convertDateStringTimeStringToDate(dateString, timeString) {
  const dateTime = moment(
    `${dateString} ${timeString}`,
    "YYYY-MM-DD HH:mm"
  ).toDate();
  return dateTime;
}
