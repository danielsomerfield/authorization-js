export class Policy {

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

export function allowIf (testFn) {
    return new Policy(testFn);
};

export function allow() {
    return {
        of: function() {
            return {
                if: function(){
                    return new Policy(()=> true);
                }
            }
        }
    };
};

export function anyResource() {
    return function() {

    };
}

class Resource {

}