import { expect } from "chai";

import { Policy, allowIf } from "../src/policy";

let request = {
    principal: {
        name: "Bob",
        department: "HR"
    },
    action: "read",
    environment: {}
}

let policy = allowIf(ctx => {
    return new RegExp(`^/${ctx.principal.department}`).test(ctx.resource.path);
});

describe('Policy', () => {
    it('should allow if function passes', () => {
        request.resource = {
            path: "/HR/documents/document1"
        };
        let result = policy.check(request);
        expect(result.code).to.equal(Policy.Result.ALLOWED);
    });

    it('should not if function does not pass', () => {
        request.resource = {
            path: "/IT/documents/document1"
        };
        let result = policy.check(request);
        expect(result.code).to.equal(Policy.Result.DENIED);
    });
});