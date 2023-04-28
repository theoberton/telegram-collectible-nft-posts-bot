import { format } from 'date-fns'


export const getShortendDate = (date: Date) => {
  return format(date, `LLL dd H:mm`); 
}