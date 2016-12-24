import { expect } from "chai";
import moment from "moment-timezone"

import { Policy, Resource, anyResource, allow, resourceByPath } from "../src/policy";
import { Environment, timeOfDay } from '../src/environment'
import { User } from './example-domain'
import { equalTo, and } from '../src/operators'

describe("Policies", () => {

    let developerPrincipal = {
        name: "Becky",
        department: "development"
    };

    describe("for any resource", () => {
        let anyResourcePolicy = allow('read')
            .of(anyResource())
            .if(and(
                User.department().is(equalTo('development')),
                timeOfDay().isDuring('9:00 PST', '17:00 PST')
                )
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

    describe("for specific resources", () => {
        let resourceSpecificPolicy = allow('read')
            .of(resourceByPath('/foo'))
            .if(User.department().is(equalTo('development')));

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