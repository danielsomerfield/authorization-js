import {Time, time} from './time'

export class Environment {

}

export function timeOfDay() {
    return {
        isBetween: function(startTime, endTime){
            return function() {
                let now = new Time();
                return now.isBetween(startTime, endTime);
            }
        }
    }
}