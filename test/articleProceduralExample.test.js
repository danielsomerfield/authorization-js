import { expect } from "chai";
import { Policy } from "../src/policy";
import { Environment, Range } from "../src/environment"

describe("Procedural Policies that are pretty nasty to look at", () => {

    let developerPrincipal = {
        name: "Becky",
        department: "development"
    };

    let anyResourcePolicy = new Policy((request)=>{
        if (request.action == 'read') {
            let start = Environment.timeStringAsUTCMillis("9:00 PST");
            let end = Environment.timeStringAsUTCMillis("17:00 PST");
            let range = new Range(start, end - start);
            if (request.principal.department == 'development' && range.isIncluded(request.environment.now)) {
                return true;
            }
        }
        return false;
    });

    let request = {
        action: 'read',
        resource: 'foo'
    };

    let hrPrincipal = {
        name: "Bob",
        department: "human resources"
    };

    it('should allow read if user is in development department and time is between 9:00 and 17:00 PST', () => {
        request.principal = developerPrincipal;

        request.environment = {
            now: new Date("2016-06-01 10:00:00 PST")
        };

        expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
    });

    it('should disallow read if user is not in development department', () => {
        request.principal = hrPrincipal;

        request.environment = {
            now: new Date("2016-06-01 10:00:00 PST")
        };

        expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.DENIED);
    });

    it('should disallow read if time is not between 9:00 and 17:00 PST.', () => {
        request.principal = developerPrincipal;

        request.environment = {
            now: new Date("2016-06-01 08:00:00 PST")
        };

        expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.DENIED);
    });

    it('should disallow write even if all read criteria are met.', () => {
        request.principal = developerPrincipal;

        request.action = 'write';

        request.environment = {
            now: new Date("2016-06-01 10:00:00 PST")
        };

        expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.DENIED);
    });
});