import moment from 'moment'

export function time(timeString){
    return new Time(new Date(`Jan 1 1970 ${timeString}`).getTime());
}

function now() {
    let now = moment();
    return now.valueOf() - now.startOf("day").valueOf(); 
}

let DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

export class Time {
    constructor(millisPastMidnight) {
        this.millisPastMidnight = millisPastMidnight || now(); 
    }

    plus(milliseconds) {
        let added = this.millisPastMidnight + milliseconds;
        if (added >= DAY_IN_MILLIS) {
             return new Time(added - DAY_IN_MILLIS);       
        }
        return new Time(added);
    }

    minus(milliseconds) {
        let subtracted = this.millisPastMidnight - milliseconds;
        if (subtracted < 0) {
            return new Time(subtracted + DAY_IN_MILLIS);
        }
        return new Time(subtracted);
    }

    isBetween(start, end) {
        return this.millisPastMidnight >= start.millisPastMidnight && this.millisPastMidnight < end.millisPastMidnight;
    }
}