import Two from "../lib/two.js"

export function buildContext(insertElement,twoParams){
    return new Two(twoParams).appendTo(insertElement);
}
