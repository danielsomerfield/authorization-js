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

export function allow(action) {
    return {
        of: function(resource) {
            return {
                if: function(testFn){
                    return new Policy((ctx)=>{
                        console.log("Checking context", ctx);
                        return true;
                    });
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