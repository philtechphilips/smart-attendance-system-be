import { DateRangeDto } from 'src/shared/dto/date-range.dto';
import {
  getTodayDateDiff,
  getFirstDayMonthAndLastDayMonth,
  getFirstDayWeekAndLastDayWeek,
  getFirstDayYearAndLastDayYear,
} from './date-range';

export const DateFilter = (
  query: DateRangeDto,
): {
  startDate: Date | null;
  endDate: Date | null;
  selectedDate: Date | null;
  pastStartDate: Date | null;
  pastEndDate: Date | null;
} => {
  const ranges = {
    startDate: null,
    endDate: null,
    selectedDate: null,
    pastStartDate: null,
    pastEndDate: null,
  };
  if (query?.period?.toLowerCase() === 'today') {
    const { startDate, endDate } = getTodayDateDiff();
    const { pastStartDate, pastEndDate } = getPastEquivalent(
      startDate,
      endDate,
    );
    ranges.startDate = startDate;
    ranges.endDate = endDate;
    ranges.pastStartDate = pastStartDate;
    ranges.pastEndDate = pastEndDate;
  }

  if (query?.period?.toLowerCase() === 'month') {
    const { startDate, endDate } = getFirstDayMonthAndLastDayMonth();
    const { pastStartDate, pastEndDate } = getPastEquivalent(
      startDate,
      endDate,
    );
    ranges.startDate = startDate;
    ranges.endDate = endDate;
    ranges.pastStartDate = pastStartDate;
    ranges.pastEndDate = pastEndDate;
  }

  if (query?.period?.toLowerCase() === 'year') {
    const { startDate, endDate } = getFirstDayYearAndLastDayYear();
    const { pastStartDate, pastEndDate } = getPastEquivalent(
      startDate,
      endDate,
    );
    ranges.startDate = startDate;
    ranges.endDate = endDate;
    ranges.pastStartDate = pastStartDate;
    ranges.pastEndDate = pastEndDate;
  }

  if (query?.period?.toLowerCase() === 'week') {
    const { startDate, endDate } = getFirstDayWeekAndLastDayWeek();
    const { pastStartDate, pastEndDate } = getPastEquivalent(
      startDate,
      endDate,
    );
    ranges.startDate = startDate;
    ranges.endDate = endDate;
    ranges.pastStartDate = pastStartDate;
    ranges.pastEndDate = pastEndDate;
  }

  if (
    query?.period?.toLowerCase() === 'custom' &&
    query?.startDate &&
    query?.endDate
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    const { pastStartDate, pastEndDate } = getPastEquivalent(
      startDate,
      endDate,
    );
    ranges.startDate = startDate;
    ranges.endDate = endDate;
    if (query?.isCustom) {
      ranges.pastStartDate = startDate;
      ranges.pastEndDate = endDate;
    } else {
      ranges.pastStartDate = pastStartDate;
      ranges.pastEndDate = pastEndDate;
    }
  }

  if (query?.period?.toLowerCase() === 'custom' && query?.selectedDate) {
    const selectedDate = new Date(query.selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);
    ranges.selectedDate = selectedDate;
    ranges.startDate = selectedDate;
    ranges.endDate = endDate;
  }

  return ranges;
};

const getPastEquivalent = (
  startDate: Date,
  endDate: Date,
): { pastStartDate: Date | null; pastEndDate: Date | null } => {
  const duration = endDate.getTime() - startDate.getTime();
  const pastStartDate = new Date(startDate.getTime() - duration);

  const pastEndDate = new Date(endDate.getTime() - duration);

  return {
    pastStartDate,
    pastEndDate,
  };
};

export const daysOfWeek = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
};

export const monthsOfYear = {
  1: 'jan',
  2: 'feb',
  3: 'mar',
  4: 'apr',
  5: 'may',
  6: 'jun',
  7: 'jul',
  8: 'aug',
  9: 'sept',
  10: 'oct',
  11: 'nov',
  12: 'dec',
};
