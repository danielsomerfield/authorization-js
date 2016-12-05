import { expect } from "chai";
import moment from "moment-timezone"

import { Policy, Resource, anyResource, allow, resourceByPath } from "../src/policy";
import { Environment, timeOfDay } from '../src/environment'
import { User } from '../src/domain'
import { and } from '../src/boolean'

describe("Policies", () => {

    let developerPrincipal = {
        name: "Becky",
        department: "development"
    };

    describe("for any resource", () => {
        let anyResourcePolicy = allow('read')
            .of(anyResource())
            .if(and(
                User.department().is('development'),
                timeOfDay().isDuring('9:00 PST', '17:00 PST'))
            );

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
                now: moment("2016-06-01T10:00:00").tz("America/Los_Angeles").toDate()
            };

            expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
        });

        it('should disallow read if user is not in development department', () => {
            request.principal = hrPrincipal;

            request.environment = {
                now: moment("2016-06-01T10:00:00").tz("America/Los_Angeles").toDate()
            };

            expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.DENIED);
        });

        it('should disallow read if time is not between 9:00 and 17:00 PST.', () => {
            request.principal = developerPrincipal;

            request.environment = {
                now: moment("2016-06-01T08:00:00").tz("America/Los_Angeles").toDate()
            };

            expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.DENIED);
        });

        it('should disallow write even if all read criteria are met.', () => {
            request.principal = developerPrincipal;

            request.action = 'write';

            request.environment = {
                now: moment("2016-06-01T10:00:00").tz("America/Los_Angeles").toDate()
            };

            expect(anyResourcePolicy.check(request).code).to.equal(Policy.Result.DENIED);
        });
    });

    xdescribe("for specific resources", () => {
        let resourceSpecificPolicy = allow('read')
            .of(resourceByPath('/foo'))
            .if(User.department().is('development'));

        it('should allow access to resource matching path', ()=>{
            let request = {
                action: 'read',
                resource: '/foo',
                principal: developerPrincipal
            };

            expect(resourceSpecificPolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
        });

        it('should deny access to resource not matching path', ()=>{
            let request = {
                action: 'read',
                resource: '/bar',
                principal: developerPrincipal
            };

            expect(resourceSpecificPolicy.check(request).code).to.equal(Policy.Result.DENIED);
        });
    });

});