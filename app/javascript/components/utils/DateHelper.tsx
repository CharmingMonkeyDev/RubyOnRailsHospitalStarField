import moment from "moment";

export function formatDDMYYdate(dateString) {
  let date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "-" +
    monthNames[date.getMonth()].toUpperCase() +
    " " +
    date.getFullYear().toString().substr(-2)
  );
}

export function formatYYMMDDdate(dateString) {
  let date = new Date(dateString);
  const formattedDate =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  return formattedDate;
}

export function formatToUsDate(dateString) {
  let date = new Date(dateString);
  const formattedDate =
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear();
  return formattedDate;
}

export function formatToUsDateFromUTC(dateString) {
  // Split the date string into its components
  const [year, month, day] = dateString.split("T")[0].split("-");

  // Format the date as "MM/DD/yyyy"
  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
}

export function dateWithTimeStamp(dateString) {
  let date = new Date(dateString);
  const formattedDate =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();
  return formattedDate;
}

export function getYodaDateToday() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

export function daysAgo(int) {
  var d = new Date();
  d.setDate(d.getDate() - int);
  return d;
}

export function monthsAgo(monthNumber: number, date = null) {
  const referenceDate = date ? new Date(date) : new Date();
  const oneMonthAgo = new Date(referenceDate);
  oneMonthAgo.setMonth(referenceDate.getMonth() - monthNumber);

  return oneMonthAgo;
}

export function formatTimeWithAMPM(dateTimeString: string): string {
  const dateTime = moment(dateTimeString);
  if (!dateTime.isValid()) {
    return "Invalid Date";
  }

  const formattedTime = dateTime.format("hh:mm A");

  return formattedTime;
}

export function dateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
