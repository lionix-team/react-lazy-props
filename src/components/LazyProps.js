import React from "react";
import { findDOMNode } from "react-dom";
import Observer from "../modules/observer";
import { compose } from "../modules/compose";
import { 
    isLazy as hasLazyAttributes, 
    unload as unloadAttributes, 
    load as loadAttributes
} from "../modules/loader/attributes";
import { 
    isLazy as hasLazyStyles,
    unload as unloadStyles,
    load as loadStyles
} from "../modules/loader/styles";

class LazyProps extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            observer: new Observer(),
            actions: {
                onElementLoad: [
                    loadAttributes, loadStyles
                ],
                onUnloadProps: [
                    unloadStyles, unloadAttributes
                ]
            }
        }
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
     * @param {Array} children
     * 
     * @return {Array}
     */ 
    unloadChildComponents = (children = this.props.children) => {
        if(!this.getProp('unloaded')){
            return React.Children.map(children, ReactElement => {
                return this.unloadComponent(ReactElement);
            });
        } else {
            return children;
        }
    }

    /**
     * Function to unload component props. Also check for
     * child components and call getChildComponents method recursively
     * 
     * @param {React.Component} reactElement
     * 
     * @return {React.Component}
     */
    unloadComponent = (reactComponent) => {
        let [
            isValid,
            childElemets,
            mustBeLazyLoaded,
            props
        ] = [
            React.isValidElement(reactComponent) ,
            reactComponent.props ? reactComponent.props.children : false,
            this.componentMustLazyLoad(reactComponent),
            reactComponent.props
        ];
        if(isValid){
            if(mustBeLazyLoaded){
                props = this.unloadComponentProps(reactComponent);
            }
            if(childElemets){
                childElemets = this.unloadChildComponents(childElemets);
            }
            if(mustBeLazyLoaded || childElemets){
                return React.cloneElement(reactComponent, props, childElemets);
            }
        }
        return reactComponent;
    }

    /**
     * Method to check if element must be lazyLoaded
     * 
     * @param {React.Component} reactElement
     * 
     * @return {boolean}
     */
    componentMustLazyLoad = reactElement => ((
        (hasLazyAttributes(reactElement) || hasLazyStyles(reactElement))
    ));
    
    /**
     * Function combining unloadStyles and unloadAttributes,
     * returns component props without autoloaded values
     * 
     * @param {Array} props
     * 
     * @return {Array}
     */
    unloadComponentProps = reactComponent => {
        let writableProps = { ...reactComponent.props };
        return this.getProp("onUnloadProps")(compose(...this.state.actions.onUnloadProps)(writableProps), reactComponent.type);
    };

    /**
     * Function to load component 
     * 
     * @param {Element} element
     */
    loadElement = (element) => {
        this.state.observer.unobserve(element);
        this.getProp("onElementLoad")(compose(...this.state.actions.onElementLoad)(element.target));
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