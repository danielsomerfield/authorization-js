import { expect } from "chai";

import { Policy, anyResource, allow } from "../src/policy";

import { Principal } from "../src/core-domain.js"

describe("Principal primvitives", ()=>{

    let principalPolicy = allow('read')
        .of(anyResource())
        .if(Principal.attribute('foo').is('bar'))

    it('should support equality matches for attributes', ()=>{
        let request = {
            action: 'read',
            resource: 'my-resource',
            principal: {
                foo: "bar"    
            }
        };

        expect(principalPolicy.check(request).code).to.equal(Policy.Result.ALLOWED);
    });
});