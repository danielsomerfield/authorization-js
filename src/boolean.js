export function and(testFunctions) {
    // let functions = arguments.length == 1 ? [testFunctions] : testFunctions;
    return function(request) {
        return testFunctions;
        // return functions.every((fn) => fn(request));
    };
}