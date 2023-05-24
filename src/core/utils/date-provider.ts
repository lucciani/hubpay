import * as dayjs from 'dayjs';
import utc = require('dayjs/plugin/utc');
import customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export const DATETIME_BR = 'DD/MM/YYYY HH:mm:ss';
export const DATETIME_US = 'YYYY-MM-DD HH:mm:ss';
export const DATE_BR = 'DD/MM/YYYY';
export const DATE_US = 'YYYY-MM-DD';

export const compareInHours = (start_date: Date, end_date: Date): number => {
  const end_date_utc = convertToUTC(end_date);
  const start_date_utc = convertToUTC(start_date);

  return dayjs(end_date_utc).diff(start_date_utc, 'hours');
};

export const convertToUTC = (date: Date): string => {
  return dayjs(date).utc().local().format();
};

export const dateValid = (value: string, format: string): boolean => {
  return dayjs(value, format, true).isValid();
};

export const compareInDays = (start_date: Date, end_date: Date): number => {
  const end_date_utc = convertToUTC(end_date);
  const start_date_utc = convertToUTC(start_date);

  return dayjs(end_date_utc).diff(start_date_utc, 'days');
};

export const dateNow = (): Date => {
  return dayjs().toDate();
};

export const addDays = (days: number): Date => {
  return dayjs().add(days, 'days').toDate();
};

export const subtractDays = (days: number): Date => {
  return dayjs().subtract(days, 'days').toDate();
};

export const addHours = (hours: number): Date => {
  return dayjs().add(hours, 'hour').toDate();
};

export const subtractHours = (hours: number): Date => {
  return dayjs().subtract(hours, 'hour').toDate();
};

export const compareIfBefore = (start_date: Date, end_date: Date): boolean => {
  return dayjs(start_date).isBefore(end_date);
};

export const dateFormat = (
  date: string,
  formatIn: string,
  formatOut: string,
): string => {
  const dateIn = dayjs(date, formatIn).toDate();
  const dateOut = dayjs(dateIn).format(formatOut);

  return dateOut;
};

export const transformDateUS = (value) =>
  value ? dayjs(value).format(DATE_US) : null;

export const transformDateBR = (value) =>
  value ? dayjs(value).format(DATE_BR) : null;
