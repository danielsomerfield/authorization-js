export class Environment {

}

Environment.dateAsUTCMillis = function(date) {
    return date.getUTCHours() * 60 * 60 * 1000 +
    date.getUTCMinutes() * 60 * 1000 +
    date.getUTCSeconds() * 1000 +
    date.getUTCMilliseconds();
};

Environment.timeStringAsUTCMillis = function(timeString) {
    return new Date(`Jan 1 1970 ${timeString}`).valueOf();
};

let DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

export class Range {
    constructor(start, length) {
        this.start = start;

        if (length > 0) {
            this.length = length;
        } else {
            this.length = length + DAY_IN_MILLIS;
        }

    }

    isIncluded(date) {
        let millis = Environment.dateAsUTCMillis(date);

        let start = this.start <= millis ? this.start : this.start - DAY_IN_MILLIS;
        let end = start + this.length;
        return start <= millis && end > millis;
    }
}

export function timeOfDay() {
    return {
        isDuring: function (startTime, endTime) {
            return function (request) {
                let nowMoment = request.environment.now;

                let startDate = Environment.timeStringAsUTCMillis(startTime);
                let endDate = Environment.timeStringAsUTCMillis(endTime);
                let range = new Range(startDate, endDate - startDate);

                return range.isIncluded(nowMoment);

            }
        }
    }
}