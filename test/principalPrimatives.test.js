import { expect } from "chai";

import { Policy, anyResource, allow } from "../src/policy";

import { Principal } from "../src/core-domain.js"

describe("Principal primvitives", ()=>{

    let principalPolicy = allow('read')
        .of(anyResource())
        .if(Principal.attribute('foo').is('bar'))

    let request = {
        action: 'read',
        resource: 'my-resource',
        principal: {
            age: 19    
        }
    };

    it('should support allow when principal attribute matches policy', ()=>{
        request.principal.foo = "bar";
        expect(principalPolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
    });

    it('should support deny when principal attribute does not policy', ()=>{
        request.principal.foo = "baz";
        expect(principalPolicy.check(request).code).to.equal(Policy.Result.DENIED);
    });

});