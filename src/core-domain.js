export class Principal {}

Principal.attribute = function(attributeName) {
    return {
        is: function(comparisonFunction) {
            return function(actualRequest) {
                return comparisonFunction(actualRequest.principal[attributeName]);
            };
        }
    };
}