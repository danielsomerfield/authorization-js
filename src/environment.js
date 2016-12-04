export class Environment {

}

Environment.nowFactory = () => new Date();

let DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

class Range {
    constructor(start, length) {
        this.start = start;

        if (length > 0) {
            this.length = length;
        } else {
            this.length = length + DAY_IN_MILLIS;
        }

    }

    isIncluded(date) {
        let millis = 
            date.getUTCHours() * 60 * 60 * 1000 +
            date.getUTCMinutes() * 60 * 1000 +
            date.getUTCSeconds() * 1000 +
            date.getUTCMilliseconds()
        ;

        let start = this.start <= millis ? this.start : this.start - DAY_IN_MILLIS;
        let end = start + this.length;

        return start <= millis && end > millis;
    }
}

export function timeOfDay() {
    return {
        isDuring: function (startTime, endTime) {
            return function () {
                let nowMoment = Environment.nowFactory();

                let startDate = new Date(`Jan 1 1970 ${startTime}`).valueOf();
                let endDate = new Date(`Jan 1 1970 ${endTime}`).valueOf();
                let range = new Range(startDate, endDate - startDate);

                return range.isIncluded(nowMoment);

            }
        }
    }
}