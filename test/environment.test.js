import { expect } from "chai";
import moment from "moment-timezone"

import { Environment, timeOfDay } from '../src/environment'

describe("Environment time", ()=>{
    let request = {
        environment: {
            
        }
    };

    it("should be aware of the time range it is in", ()=>{
        request.environment.now = new Date("2016-06-01T15:01:00Z");
        expect(timeOfDay().isDuring('14:00Z', '17:00Z')(request)).to.equal(true);
        expect(timeOfDay().isDuring('16:00Z', '17:00Z')(request)).to.equal(false);
    });

    it("should be aware of the time range it is in when the range crosses over days", ()=>{
        request.environment.now = new Date("2016-06-01T15:01:00Z");
        expect(timeOfDay().isDuring('14:00Z', '2:00Z')(request)).to.equal(true);
        expect(timeOfDay().isDuring('16:00Z', '2:00Z')(request)).to.equal(false);
    });

    it("should be aware of the time range it is in when the range and date cross over days", ()=>{
        Environment.nowFactory = ()=> new Date("2016-06-01T01:01:00Z");
        expect(timeOfDay().isDuring('14:00Z', '2:00Z')(request)).to.equal(true);
        expect(timeOfDay().isDuring('16:00Z', '0:05Z')(request)).to.equal(false);
    });

    it("should adjust to timezones", ()=>{
        request.environment.now = new Date("2016-06-01 15:01:00 PST");
        expect(timeOfDay().isDuring('14:00 PST', '17:00 PST')(request)).to.equal(true);
        expect(timeOfDay().isDuring('16:00 PST', '17:00 PST')(request)).to.equal(false);
    });

    it("should work with mixed timezones", ()=>{
        request.environment.now = new Date("2016-06-01 15:01:00 PST"); 
        expect(timeOfDay().isDuring('21:00Z', '23:59Z')(request)).to.equal(true);
        expect(timeOfDay().isDuring('21:00Z', '21:59Z')(request)).to.equal(false);
    });
});