import { DateStatus, FunctionStatus } from "../enums";
import { TimeInHHMM, YYYYMMDD } from "../types";
import { logFunctionInfo, logger } from "../utils";



/**
 * To get Date from date and tiime strings
 */
export const getDateFromStrings = (dateString: YYYYMMDD, timeString: TimeInHHMM): Date => {
    logFunctionInfo(getDateFromStrings.name, FunctionStatus.START);
    const time = timeString.split(':');
    const hours = Number(time[0]);
    const minutes = Number(time[1]);

    const date = new Date(dateString);
    date.setHours(hours, minutes);
    return date;
}


/**
 * To compare inputed date with current date
 * @returns the status as `past`, `present` or `future`
*/
export const compareDatesWithCurrentDate = (inputDate: YYYYMMDD): DateStatus => {
    logFunctionInfo(compareDatesWithCurrentDate.name, FunctionStatus.START);

    const date = new Date(inputDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate > date) {
        return DateStatus.Past;
    } else if (currentDate < date) {
        return DateStatus.Future;
    } else {
        return DateStatus.Present;
    }
};