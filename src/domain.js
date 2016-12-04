export class User {

}

User.department = function() {
    return {
        is: function(expectedDepartment) {
            return function(actualRequest) {
                return expectedDepartment == actualRequest.principal.department;
            }
        }
    };
}