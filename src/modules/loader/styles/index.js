import { map as stylesMap } from './map';

export const isLazy = elementProps => {
    let toReturn = false;
    if(elementProps && elementProps.style){
        toReturn = Object.keys(stylesMap).some(key => {
            return elementProps.style[key];
        });
    }
    return toReturn;
};

export const unload = props => {
    let toReturn = props;
    if(toReturn.style){
        Object.keys(stylesMap).forEach(style => {
            let lazyStyleName = stylesMap[style];
            if(toReturn.style[style]){
                toReturn[lazyStyleName] = toReturn.style[style];
                toReturn.style[style] = undefined;
            }
        });
    }
    return toReturn;
};

export const load = elementTarget => {
    if(elementTarget){
        Object.keys(stylesMap).forEach(styleName => {
            let lazyAttributeName = stylesMap[styleName];
            let elementLazyAttribute = elementTarget.getAttribute(lazyAttributeName);
            if(elementLazyAttribute){
                elementTarget.removeAttribute(lazyAttributeName);
                elementTarget.style[styleName] = elementLazyAttribute;
            }
        });
    }
    return elementTarget;
};