# Authorization JS

This is an example of how you could create a JavaScript DSL for creating ABAC authorization 
policy, comparable to XACML, but much easier to read. 

# Policy Example 1: A basic attribute-based policy
This policy will allow a user with a particular group to access any resource during business hours.

    let anyResourcePolicy = allow('read')
        .of(anyResource())
        .if(and(
            User.department().is('development'),
            timeOfDay().isDuring('9:00 PST', '17:00 PST'))
        );

        
# Policy Example 1: A resource-specific policy
This policy will allow a user with a particular group to access the "/foo" resource.

    let resourceSpecificPolicy = allow('read')
        .of(resourceByPath('/foo'))
        .if(User.department().is('development'));