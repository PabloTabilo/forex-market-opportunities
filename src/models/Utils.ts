export function normalizeToZero(value : number, epsilon : number = 1e-12){
    if(Math.abs(value) < epsilon){
        return 0;
    }
    return value;
  }
  
export function check_nearest(new_distance : number, current_distance : number, epsilon : number = 1e-12) : boolean{
    if(Math.abs(new_distance - current_distance) < epsilon){
        return false;
    }
    return (new_distance < current_distance);
  }