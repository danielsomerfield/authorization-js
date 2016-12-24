import { expect } from "chai";

import { Policy, anyResource, allow } from "../src/policy";

import { Principal } from "../src/core-domain.js"
import { equalTo } from '../src/operators'

describe("Principal primvitives", ()=>{

    describe("attribute equality", ()=>{
        let principalPolicy = allow('read')
            .of(anyResource())
            .if(Principal.attribute('foo').is(equalTo('bar')))

        let request = {
            action: 'read',
            resource: 'my-resource',
            principal: {   
            }
        };

        it('should allow when principal attribute matches policy', ()=>{
            request.principal.foo = "bar";
            expect(principalPolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
        });

        it('should deny when principal attribute does not policy', ()=>{
            request.principal.foo = "baz";
            expect(principalPolicy.check(request).code).to.equal(Policy.Result.DENIED);
        });
    });

    // describe("attribute comparison", ()=>{
    //       let principalPolicy = allow('read')
    //         .of(anyResource())
    //         .if(Principal.attribute('age').is(greaterThan(35)))

    //     let request = {
    //         action: 'read',
    //         resource: 'my-resource',
    //         principal: {   
    //         }
    //     };

    //     it('should allow when principal attribute matches policy', ()=>{
    //         request.principal.age = 36;
    //         expect(principalPolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
    //     });

    //     // it('should deny when principal attribute does not policy', ()=>{
    //     //     request.principal.foo = 34;
    //     //     expect(principalPolicy.check(request).code).to.equal(Policy.Result.DENIED);
    //     // });      
    // });

});