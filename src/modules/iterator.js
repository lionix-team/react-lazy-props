import { Children, isValidElement, cloneElement } from "react";

const componentIterator = (reactChildren, callback) => {
    let toReturn = reactChildren;
    if(reactChildren){
        toReturn = Children.map(reactChildren, reactElement => {
            if(isValidElement(reactElement)){
                return cloneElement(
                    reactElement,
                    callback({ ...reactElement.props }, reactElement),
                    componentIterator(reactElement.props.children, callback)
                );
            }
            return reactElement;
        });
    }
    return toReturn;
}

export default componentIterator;