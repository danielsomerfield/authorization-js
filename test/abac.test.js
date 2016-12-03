import { expect } from "chai";

class Policy {
    constructor(policyFn) {
        this.policyFn = policyFn;
    }

    check(env) {
        if (this.policyFn(env)) {
            return {
                code: Policy.Result.ALLOWED
            };
        } else {
             return {
                code: Policy.Result.DENIED
            };           
        }
    }
}

Policy.Result = {
    ALLOWED: "Allowed",
    DENIED: "Denied"
}

Policy.allowIf = function (testFn) {
    return new Policy(testFn);
};

let ctx = {
    principal : {
        name: "Bob",
        department: "HR"
    },
    action: "read",
    environment: {}
}

let policy = Policy.
    allowIf(ctx => {
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