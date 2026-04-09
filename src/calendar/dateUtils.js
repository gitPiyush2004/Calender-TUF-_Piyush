export const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

export const firstWeekdayMondayStart = (year, monthIndex) => {
  const weekday = new Date(year, monthIndex, 1).getDay();
  return weekday === 0 ? 6 : weekday - 1;
};

export const isSameDate = (a, b) =>
  Boolean(
    a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate(),
  );

export const isBetweenDates = (date, start, end) => {
  if (!start || !end) return false;
  const t = date.getTime();
  return t >= Math.min(start.getTime(), end.getTime()) && t <= Math.max(start.getTime(), end.getTime());
};

export const isToday = (date) => isSameDate(date, new Date());
