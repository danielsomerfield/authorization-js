import { expect } from "chai";
import moment from "moment-timezone"

import { Environment, timeOfDay } from '../src/environment'

describe("Declarative policy for environmental and user attributes", ()=>{
    it("should be aware of the time range it is in", ()=>{
        Environment.nowFactory = ()=> new Date("2016-06-01T15:01:00Z");
        expect(timeOfDay().isDuring('14:00Z', '17:00Z')()).to.equal(true);
        expect(timeOfDay().isDuring('16:00Z', '17:00Z')()).to.equal(false);
    });

    it("should be aware of the time range it is in when the range crosses over days", ()=>{
        Environment.nowFactory = ()=> new Date("2016-06-01T15:01:00Z");
        expect(timeOfDay().isDuring('14:00Z', '2:00Z')()).to.equal(true);
        expect(timeOfDay().isDuring('16:00Z', '2:00Z')()).to.equal(false);
    });

    it("should be aware of the time range it is in when the range and date cross over days", ()=>{
        Environment.nowFactory = ()=> new Date("2016-06-01T01:01:00Z");
        expect(timeOfDay().isDuring('14:00Z', '2:00Z')()).to.equal(true);
        expect(timeOfDay().isDuring('16:00Z', '0:05Z')()).to.equal(false);
    });
});