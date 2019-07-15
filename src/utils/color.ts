import { MD5 } from "./MD5";

var stringToColour = function(str: string | String) {
    return '#' + MD5(str).slice(0, 6);
}

export { stringToColour }