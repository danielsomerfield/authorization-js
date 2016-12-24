import {Principal} from '../src/core-domain';

export class User {

}

User.department = function() {
    return Principal.attribute("department");
}