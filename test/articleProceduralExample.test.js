import { expect } from "chai";
import moment from "moment-timezone"

import { Policy, Resource, anyResource, allowIf, resourceByPath } from "../src/policy";
import { Environment, timeOfDay } from '../src/environment'
import { User } from '../src/domain'
import { and } from '../src/boolean'

describe("Procedural Policies that are pretty nasty to look at", () => {

    let developerPrincipal = {
        name: "Becky",
        department: "development"
    };

    let timeStringAsUTCMillis = function(timeString) {
        return new Date(`Jan 1 1970 ${timeString}`).valueOf();
    };

    let dateAsUTCMillis = function(date) {
        return date.getUTCHours() * 60 * 60 * 1000 +
        date.getUTCMinutes() * 60 * 1000 +
        date.getUTCSeconds() * 1000 +
        date.getUTCMilliseconds();
    };

    let anyResourcePolicy = allowIf((request)=>{
        if (request.action == 'read') {
            if (
                request.principal.department == 'development' && 
                dateAsUTCMillis(request.environment.now) >= timeStringAsUTCMillis("9:00 PST") && 
                dateAsUTCMillis(request.environment.now) < timeStringAsUTCMillis("17:00 PST")
            ) {
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