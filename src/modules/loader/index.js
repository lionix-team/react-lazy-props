import { compose } from "../compose";
import { isLazy as hasLazyAttributes, unload as unloadAttributes, load as loadAttributes } from "./attributes";
import { isLazy as hasLazyStyles, unload as unloadStyles, load as loadStyles } from "./styles";

export const isLazy = elementProps => (
    hasLazyAttributes(elementProps) || hasLazyStyles(elementProps)
);

export const unload = props => (
    compose(unloadAttributes, unloadStyles)(props)
);

export const load = elementTarget => (
    compose(loadAttributes, loadStyles)(elementTarget)
);