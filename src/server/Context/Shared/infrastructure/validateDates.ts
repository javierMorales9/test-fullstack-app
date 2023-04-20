export function validateDates(...dates: (string | undefined)[]) {
  return dates.map((el) => {
    if (el === undefined) return el;

    const date = new Date(el);
    if (isNaN(date.getTime()))
      throw new Error(
        "Date " + el + " not valid. Use the YYYY-MM-DD format instead",
      );

    return date;
  });
}
