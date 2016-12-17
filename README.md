# Authorization JS

This is an example of how you could create a JavaScript DSL for creating ABAC authorization 
policy, comparable to XACML, but much easier to read. 

# A basic attribute-based policy using the DSL
This policy will allow a user with a particular group to access any resource during business hours.

    allow('read')
        .of(anyResource())
        .if(and(
            User.department().is('development'),
            timeOfDay().isDuring('9:00 PST', '17:00 PST'))
        );

# A basic attributed-based policy using the underlying libraries, but not using the DSL

    new Policy((request)=>{
        if (request.action == 'read') {
            let start = Environment.timeStringAsUTCMillis("9:00 PST");
            let end = Environment.timeStringAsUTCMillis("17:00 PST");
            let range = new Range(start, end - start);
            if (request.principal.department == 'development' && range.isIncluded(request.environment.now)) {
                return true;
            }
        }
        return false;
    })
        
# Policy Example 2: A resource-specific policy using the DSL
This policy will allow a user with a particular group to access the "/foo" resource.

    allow('read')
        .of(resourceByPath('/foo'))
        .if(User.department().is('development'));