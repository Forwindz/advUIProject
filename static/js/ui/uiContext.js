import Two from "../lib/two.js"

export function buildContext(insertElement,twoParams){
    return two = new Two(twoParams).appendTo(insertElement);
}
