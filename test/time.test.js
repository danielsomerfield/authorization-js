import { expect } from "chai";
import moment from "moment-timezone"
import { Time, time } from '../src/time'

describe("Time", ()=>{
    it('should be comparable', ()=>{
        let now = new Time();
        let later = now.plus(5000);
        let earlier = now.minus(5000);
        expect(now.isBetween(earlier, later)).to.equal(true);
        expect(now.isBetween(later, earlier)).to.equal(false);
        expect(now.isBetween(later, later)).to.equal(false);
    });

    it ('should parse times with time zones', ()=>{
        let parsed = time('14:05 PST');
        expect(parsed).to.deep.equal(new Time(79500000));
    });

    //TODO: test roll if greater than 24 hours
    it ('should roll if reaching 24 hours', ()=>{
        let parsed = time('23:55 UTC');
        expect(parsed.plus(5 * 60 * 1000)).to.deep.equal(new Time(0));
        expect(parsed.plus(6 * 60 * 1000)).to.deep.equal(time('00:01 UTC'));
    });

    it ('should roll if reaching less than 0', ()=>{
        let parsed = time('00:05 UTC');
        expect(parsed.minus(5 * 60 * 1000)).to.deep.equal(new Time(0));
        expect(parsed.minus(6 * 60 * 1000)).to.deep.equal(time('23:59 UTC'));
    });
});