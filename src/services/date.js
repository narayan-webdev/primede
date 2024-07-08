export function getDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  return formattedDate;
}
export function getValidToDates(days) {
  const currentDate = new Date();
  const laterDate = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000); // Adding 28 days in milliseconds

  const year = laterDate.getFullYear();
  const month = String(laterDate.getMonth() + 1).padStart(2, "0");
  const day = String(laterDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  return formattedDate;
}
export function getPreviousDates(days) {
  const currentDate = new Date();
  const laterDate = new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000); // Adding 28 days in milliseconds

  const year = laterDate.getFullYear();
  const month = String(laterDate.getMonth() + 1).padStart(2, "0");
  const day = String(laterDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  return formattedDate;
}
export function updatetValidToDates(days, validFrom) {
  const laterDate = new Date(validFrom.getTime() + days * 24 * 60 * 60 * 1000); // Adding 28 days in milliseconds

  const year = laterDate.getFullYear();
  const month = String(laterDate.getMonth() + 1).padStart(2, "0");
  const day = String(laterDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  // console.log(formattedDate);
  return formattedDate;
}
