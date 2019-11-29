import { map as attributesMap } from './map';

export const isLazy = elementProps => {
    let toReturn = false;
    if(elementProps){
        toReturn = Object.keys(attributesMap).some(key => {
            return elementProps[key];
        });
    }
    return toReturn;
};

export const unload = props => {
    let toReturn = props;
    Object.keys(attributesMap).forEach(attribute => {
        let lazyAttribute = attributesMap[attribute];
        if(toReturn[attribute]){
            toReturn[lazyAttribute] = toReturn[attribute];
            toReturn[attribute] = undefined;
        }
    });
    return toReturn;
};

export const load = elementTarget => {
    if(elementTarget){
        Object.keys(attributesMap).forEach(attribute => {
            let lazyAttributeName = attributesMap[attribute];
            let elementLazyAttribute = elementTarget.getAttribute(lazyAttributeName);
            if(elementLazyAttribute){
                elementTarget.removeAttribute(lazyAttributeName);
                elementTarget.setAttribute(attribute, elementLazyAttribute);
            }
        });
    }
    return elementTarget;
}