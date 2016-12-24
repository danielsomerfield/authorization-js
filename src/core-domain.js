export class Principal {}

Principal.attribute = function(attributeName) {
    return {
        is: function(expectedValue) {
            return function(actualRequest) {
                return expectedValue == actualRequest.principal[attributeName];
            };
        }
    };
}