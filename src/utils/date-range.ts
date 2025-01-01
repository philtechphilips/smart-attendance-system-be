import { DateTime } from 'luxon';
import { CompareDate } from 'src/shared/enums/constants.enum';

type ReturnValue = {
  startDate: Date;
  endDate: Date;
};

const currentDate = new Date();

export const getTodayDateDiff = (): ReturnValue => {
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );

  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
  );

  return { startDate, endDate };
};

export const getFirstDayMonthAndLastDayMonth = (): ReturnValue => {
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  return { startDate, endDate };
};

export const getFirstDayYearAndLastDayYear = (): ReturnValue => {
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const endDate = new Date(currentDate.getFullYear(), 11, 31);

  return { startDate, endDate };
};

export const getFirstDayWeekAndLastDayWeek = (): ReturnValue => {
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay() + 1,
  );

  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay() + 7,
  );

  return { startDate, endDate };
};

export const getCurrentMonthAndYear = (): {
  currentMonth: number;
  currentYear: number;
} => {
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return { currentMonth, currentYear };
};

export const getPreviousWeekDate = (): {
  previousWeekStart: Date;
  previousWeekEnd: Date;
} => {
  const previousWeekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - (currentDate.getDay() + 6),
  );

  const previousWeekEnd = new Date(
    previousWeekStart.getFullYear(),
    previousWeekStart.getMonth(),
    previousWeekStart.getDate() + 6,
  );

  return { previousWeekStart, previousWeekEnd };
};

export const compareDate = (
  initial: Date | null,
  comapre: Date | null,
  condition: CompareDate,
): boolean => {
  const start = new Date(initial) || new Date(Date.now());
  const end = new Date(comapre) || new Date(Date.now());
  switch (condition) {
    case CompareDate.GREATER:
      return start < end;
    case CompareDate.LESSER:
      return start > end;
    case CompareDate.EQUAL:
      return start === end;
  }
};

export function getFourWeeksBeforeDate(inputDate: Date) {
  const fourWeeksBeforeDate = new Date(inputDate);
  fourWeeksBeforeDate.setDate(fourWeeksBeforeDate.getDate() - 21);
  return fourWeeksBeforeDate;
}

export function getOneWeekBeforedate(inputDate: Date) {
  const oneWeekBeforeDate = new Date(inputDate);
  oneWeekBeforeDate.setDate(oneWeekBeforeDate.getDate() - 7);
  return oneWeekBeforeDate;
}

export function getOneWeekAfterDate(inputDate: Date) {
  const oneWeekAfterDate = new Date(inputDate);

  oneWeekAfterDate.setDate(oneWeekAfterDate.getDate() + 7);

  return oneWeekAfterDate;
}

export function getFourWeeksAfterDate(inputDate: Date) {
  const fourWeeksAfterDate = new Date(inputDate);

  fourWeeksAfterDate.setDate(fourWeeksAfterDate.getDate() + 35);

  return fourWeeksAfterDate;
}

function getWeekNumber(date: Date): number {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return weekNumber;
}

export function getWeeksBetween(startDate, endDate) {
  const weeks = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1;
    const week = getWeekNumber(currentDate);
    weeks.push({ year, month, week });
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return weeks;
}

export function groupPointsByWeek(queryResults) {
  const groupedData = {};

  queryResults.forEach((row) => {
    const week = getWeekNumber(new Date(row.date));
    if (!groupedData[week]) {
      groupedData[week] = 0;
    }

    groupedData[week] += row.pointsBefCoaching;
  });

  return groupedData;
}

export function calculatePointsByWeek(groupedPoints, startDate, endDate) {
  const weeksBetween = getWeeksBetween(startDate, endDate);
  const result = [];

  for (const week of weeksBetween) {
    result.push({
      year: week.year,
      month: week.month,
      week: week.week,
      point: groupedPoints[week.week] || 0,
    });
  }

  return result;
}

export function getStartAndEndOfDate(input: Date) {
  const startDate = new Date(
    input.getFullYear(),
    input.getMonth(),
    input.getDate() - input.getDay() + 1,
  );

  const endDate = new Date(
    input.getFullYear(),
    input.getMonth(),
    input.getDate() - input.getDay() + 7,
  );

  return { startDate, endDate };
}

export function getStartDateAndPointForWeeks(weeklyData) {
  const result = [];

  for (const weekData of weeklyData) {
    const { year, week, point } = weekData;

    const startDate = new Date(year, 0);
    startDate.setDate(startDate.getDate() + (week - 1) * 7);

    const formattedStartDate = startDate.toLocaleString('en-us', {
      month: 'short',
      day: '2-digit',
    });

    result.push({
      startDate: formattedStartDate,
      point: point,
    });
  }

  return result;
}

export const getDaysInMonth = (year: number, month: number) => {
  return DateTime.local(year, month).daysInMonth;
};

export const getDifferenceInMinutes = (date1: string, date2: string) => {
  const dateTime1 = DateTime.fromISO(date1);
  const dateTime2 = DateTime.fromISO(date2);

  const diff = dateTime2.diff(dateTime1, 'minutes');

  return diff.minutes;
};

export const getPast90DaysDate = (): { current: string; past: string } => {
  const currentDate = DateTime.now();

  const endDate = new Date(DateTime.now().toISODate());
  endDate.setHours(23, 59, 59, 999);

  const pastDate = currentDate.minus({ days: 90 });

  const pastDateStr = pastDate.toISODate();

  console.log('Past date:', pastDateStr);

  return { current: endDate.toISOString(), past: pastDateStr };
};
