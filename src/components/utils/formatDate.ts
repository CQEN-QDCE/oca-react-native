import moment from 'moment';
import type { FormatValueProps } from '../types';

export const formatDate = ({ value, format }: FormatValueProps) => {
  if (typeof value !== 'string') {
    return value;
  }
  const isValidDate = Date.parse(value);
  let currentData: Date | moment.Moment;
  if (!isNaN(isValidDate)) {
    currentData = new Date(value);
  } else if (isNaN(isValidDate) && moment(value, format).isValid()) {
    currentData = moment(value, format);
  } else {
    return value;
  }
  return moment(currentData).format(format);
};
