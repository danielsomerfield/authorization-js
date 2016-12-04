export function and(...testFunctions) {
    return function(request) {
        return testFunctions.every((fn) => fn(request));
    };
}