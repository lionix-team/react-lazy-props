import { getLazyPropNames } from "./loader/map";

class Observer {
    constructor(){
        this.state = {
            observer: false
        };
    }

    getLazySelector = () => {
        let toReturn = false;
        let queryArr = getLazyPropNames();
        if(queryArr && queryArr.length){
            toReturn = "["+queryArr.join("], [")+"]";
        }
        return toReturn;
    }

    isObserving = () => {
        return (this.state.observer !== false);
    }

    create = (callback, DOMElement) => {
        this.state.observer = new IntersectionObserver(elements => {
            elements.forEach(element => {
                if(element.isIntersecting === true){
                    callback(element);
                }
            });
        }, {
            root: null,
            threshold: 0.1
        });
        if(DOMElement){
            this.observe(DOMElement);
        }
    }

    observe = DOMElement => {
        if(this.isObserving()){
            let elements = DOMElement.querySelectorAll(this.getLazySelector());
            for(let i = 0; i < elements.length; i++){
                let element = elements[i];
                this.state.observer.observe(element);
            }
        }
    }

    unobserve = element => {
        if(this.isObserving()){
            this.state.observer.unobserve(element.target);
        }
    }

    endobserve = () => {
        if(this.isObserving()){
            this.state.observer.disconnect();
        }
    }
}

export default Observer;