export class Environment {

}

export function timeOfDay() {
    return {
        isBetween: function(request){
            return ()=>true;
        }
    }
}