import React from "react";
import { findDOMNode } from "react-dom";
import Observer from "../modules/observer";
import { isLazy as hasLazyProps, unload as unloadComponentProps, load as loadElementAttributes } from "../modules/loader";
import componentIterator from '../modules/iterator';

class LazyProps extends React.Component {
    
    /**
     * State:
     * - Observer instance
     * - Actions to be invoked
     * 
     * @var {Object} state
     */
    constructor(props){
        super(props);
        this.state = {
            observer: new Observer(),
            onElementLoad: loadElementAttributes,
            onUnloadProps: unloadComponentProps
        }
    }

    /**
     * Get prop and fallback to default prop in case of:
     * - Property doesnt exists
     * - Property type is not equivalent to default property
     * 
     * @param {String} propName
     * 
     * @return {mixed}
     */
    getProp = propName => {
        let defaultProp = LazyProps.defaultProps[propName];
        if(!this.props.hasOwnProperty(propName) || typeof this.props[propName] !== typeof defaultProp){
            return defaultProp;
        } else {
            return this.props[propName];
        }
    }

    /**
     * Observe elements with package observer API,
     * Pass Callback function and DOM Node
     */
    observeElements = () => {
        if(this.props.children){
            this.state.observer.create(
                (element) => this.loadElement(element),
                findDOMNode(this)
            );
        }
    }

    /**
     * Method to rewrite child components by unloading their props
     * 
     * @return {Array}
     */ 
    unloadChildComponents = () => {
        let toReturn = this.props.children;
        if(!this.getProp('unloaded')){
            toReturn = componentIterator(this.props.children, this.unloadComponentProps);
        }
        return toReturn;
    };
    
    /**
     * Function combining unloadStyles and unloadAttributes,
     * returns component props without autoloaded values
     * 
     * @param {Array} props
     * 
     * @return {Array|undefined}
     */
    unloadComponentProps = (props, reactElement) => {
        if(hasLazyProps(props)){
            let unloadedProps = this.state.onUnloadProps(props);
            let userActionResult = this.getProp("onUnloadProps")(unloadedProps, reactElement.type);
            if(userActionResult instanceof Object){
                return { ...unloadedProps, ...userActionResult };
            }
        }
    };

    /**
     * Function to load component 
     * 
     * @param {Element} element
     */
    loadElement = (element) => {
        this.state.observer.unobserve(element);
        this.getProp("onElementLoad")(this.state.onElementLoad(element.target));
    }

    componentDidMount = () => {
        this.observeElements();
    }

    componentDidUpdate = () => {
        this.state.observer.endobserve();
        this.observeElements();
    }

    componentWillUnmount = () => {
        this.state.observer.endobserve();
    }

    render(){
        return this.props.children ? this.unloadChildComponents() : ( <div></div> );
    }
}

/**
 * Component default props
 * 
 * @prop {boolean} unloaded 
 * 
 * @prop {function} onElementLoad 
 * 
 * @prop {function} onUnloadProps 
 */
LazyProps.defaultProps = {
    unloaded: false,
    onElementLoad: (args) => args,
    onUnloadProps: (args) => args
};

export default LazyProps;