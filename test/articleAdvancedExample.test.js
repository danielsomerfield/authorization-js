import { expect } from "chai";
import moment from "moment-timezone"

import { Policy, Resource, anyResource, allow } from "../src/policy";
import { Environment, time, timeOfDay } from '../src/environment'
import { User } from '../src/domain'
import { and } from '../src/boolean'

describe("Declarative policy for environmental and user attributes", ()=>{

    let policy = allow('read')
        .of(anyResource())
        .if(
            and(
                User.department().is('development'),
                timeOfDay().isBetween(time('9:00 PST'), time('17:00 PST'))
            )
        );
    
    let request = {
        action: 'read',
        resource: 'foo'
    };

    it('should allow read if user is in development department and time is between 9:00 and 17:00 PST', ()=>{
        request.principal = {
            name: "Bob",
            department: "development"
        };

        request.environment = {
            now: moment("2016-06-01T10:00:00").tz("PST")
        };

        expect(policy.check(request).code).to.equal(Policy.Result.ALLOWED);
    });

    xit('should disallow read if user is not in development department', ()=>{
        request.principal = {
            name: "Bob",
            department: "human resources"
        };

        request.environment = {
            now: moment("2016-06-01T10:00:00").tz("PST")
        };

        expect(policy.check(ctx).code).to.equal(Policy.Result.DENIED);
    });    

    xit('should disallow read if time is not between 9:00 and 17:00 PST.', ()=>{

    });

    xit('should disallow write even if all read criteria are met.', ()=>{

    });


    //TODO: deny overrides
    //TODO: resource-specific policies
    //TODO: OR policies
});