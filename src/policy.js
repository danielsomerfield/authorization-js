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

export function allowIf(testFn) {
    return new Policy(testFn);
};

export function allow(allowedAction) {
    let allowedStructure = {

    };

    return {
        of: function (resource) {
            return {
                if: function (testFunction) {
                    allowedStructure[allowedAction] = testFunction;
                    return new Policy((request) => {
                        let action = request.action;
                        let testFn = allowedStructure[action];
                        return testFn && testFn(request);
                    });
                }
            }
        }
    };
};


export function anyResource() {
    return function () {

    };
}

class Resource {

}