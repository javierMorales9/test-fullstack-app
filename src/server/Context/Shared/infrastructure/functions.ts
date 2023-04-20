//import logger from "jet-logger";
import mongoose from "mongoose";

/**
 * Print an error object if it's truthy. Useful for testing.
 *
 * @param err
 */
export function pErr(err?: Error): void {
  if (!!err) {
    //logger.err(err);
  }
}

/**
 * Get a random number between 1 and 1,000,000,000,000
 *
 * @returns
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

export function checkThatTheMongoIdIsCorrect(id: string): boolean {
  let mongoId: mongoose.Types.ObjectId | null = null;
  try {
    mongoId = new mongoose.Types.ObjectId(id);
  } catch (err) {
    mongoId = null;
  }

  return mongoId ? true : false;
}

/**
 * Formats a date request the yyyy-MM-dd format.
 */
export function formatEuropeanDate(date: Date): string {
  return dateFormat(date, "yyyy-MM-dd");
}

/**
 * Formats a date request the given format.
 */
export function dateFormat(date: Date, format: string): string {
  //extract the parts of the date
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //replace the month
  format = format.replace("MM", month.toString().padStart(2, "0"));

  //replace the year
  if (format.indexOf("yyyy") > -1)
    format = format.replace("yyyy", year.toString());
  else if (format.indexOf("yy") > -1)
    format = format.replace("yy", year.toString().substr(2, 2));

  //replace the day
  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
}
