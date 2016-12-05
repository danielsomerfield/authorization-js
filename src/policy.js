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

export function allow(action) {
    let allowedStructure = {
    };

    let addOrCreateEntry = function(resource, action, fn) {
        allowedStructure[resource] = allowedStructure[resource] || {}
        allowedStructure[resource][action] = fn;
    };

    let getTestFunction = function(resource, action) {
        let actions = allowedStructure[resource] || allowedStructure[Resource.ALL];
        return actions && actions[action];
    }

    return {
        of: function (resource) {
            return {
                if: function (testFunction) {
                    allowedStructure[action] = addOrCreateEntry(resource, action, testFunction);
                    return new Policy((request) => {
                        let testFn = getTestFunction(resourceByPath(request.resource), request.action);
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

    toString() {
        return "Resource: " + this.name;
    }
}

Resource.ALL = new Resource("*");