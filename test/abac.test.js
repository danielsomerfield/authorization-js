import { expect } from "chai";

import { Policy, allowIf } from "../src/policy";

let ctx = {
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
        ctx.resource = {
            path: "/HR/documents/document1"
        };
        let result = policy.check(ctx);
        expect(result.code).to.equal(Policy.Result.ALLOWED);
    });

    it('should not if function does not pass', () => {
        ctx.resource = {
            path: "/IT/documents/document1"
        };
        let result = policy.check(ctx);
        expect(result.code).to.equal(Policy.Result.DENIED);
    });
});