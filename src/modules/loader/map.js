import { map as attributesMap } from './attributes/map';
import { map as stylesMap } from './styles/map';

export const getLazyPropNames = () => ([
    ...Object.keys(stylesMap).map(key => stylesMap[key]), ...Object.keys(attributesMap).map(key => attributesMap[key])
]);

export const getMap = () => ({
    ...attributesMap, style: { ...stylesMap }
});