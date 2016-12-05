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
        "*": (action)=>false
    };

    let addOrCreateEntry = function(resource, action, fn) {
        allowedStructure[resource] = allowedStructure[resource] || {}
        allowedStructure[resource][action] = fn;
    };

    return {
        of: function (resource) {
            return {
                if: function (testFunction) {
                    allowedStructure[allowedAction] = addOrCreateEntry(resource, allowedAction, testFunction);
                    return new Policy((request) => {
                        let action = request.action;
                        let testFn = allowedStructure[resource][action];
                        return testFn && testFn(request);
                    });
                }
            }
        }
    };
};


export function anyResource() {
    return Resource.ALL;
}

export function resourceByPath(name) {
    return new Resource(name);
}

class Resource {
    constructor(name) {
        this.name = name;
    }
}

Resource.ALL = new Resource("*");