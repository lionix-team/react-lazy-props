# react-lazy-props &nbsp;[![](https://img.shields.io/npm/dt/react-lazy-props.svg)](https://www.npmjs.com/package/react-lazy-props) [![](https://img.shields.io/npm/v/react-lazy-props.svg)](https://www.npmjs.com/package/react-lazy-props)

LazyLoad media elements with `react-lazy-props` and `IntersectionObserver`


## Installation

```bash
npm i react-lazy-props
```


## Usage

Wrap the elements you want to lazyload with `LazyProps` component  
It will unload media before components were mounted and will load them only when they are observed.

### Example:

```js
import LazyProps from "react-lazy-props";
...
return (
 <LazyProps>
  <div>
   <h2 style={{backgroundImage: `url("${backgroundImage}")`}}>Title</h2>
   <p>Some Images</p>
   <img src="example.jpg" srcSet={"example2x.jpg 2x", "example3x.jpg 3x"} />
   <video src="https://www.example.com/video.ogg" />
  </div>
 </LazyProps>
);
```

### Unloading process:

`LazyProps` renders its child components with props and styles replaced according to the map:

- `src` to `data-src`
- `srcSet` to `data-srcset`
- `backgroundImage` to `data-bg-src`

#### HTML Output (Unloaded):

```html
<div>
 <h2 data-bg-src="url('background-image.png')">Title</h2>
 <p>Some Images</p>
 <img data-src="example.jpg" data-srcset="example2x.jpg 2x, example3x.jpg 3x" />
 <video data-src="https://www.example.com/video.ogg" />
</div>
```

### Loading process:

`LazyProps` component observes NodeList with **Unloaded Prop Keys** using `IntersectionObserverAPI`.  
As soon as at least 1/10 of Node element is intersected, element props will gain thier initial key.

#### HTML Output (Loaded):

```html
<div>
 <h2 style="background-image: url('background-image.png')">Title</h2>
 <p>Some Images</p>
 <img src="example.jpg" srcset="example2x.jpg 2x, example3x.jpg 3x" />
 <video src="https://www.example.com/video.ogg" />
</div>
```


## Component Props

### children (undefined)

**NOTE!** Always wrap child components as `LazyProps` component returns its children unwrapped.


### onElementLoad (function)

**Arguments:**
- `element` - Node Object

Function will be invoked when one of the child elements is intersected.

```js
import LazyProps from "react-lazy-props";
...
 doSomething(element){
   element.classList.add("intersected");
 }
}
...
render {
 return (
  <LazyProps onElementLoad={element => this.doSomething(element)}>
...
```


### onUnloadProps (function)

**Arguments:**
- `props` - Object
- `componentType` - String

Function will be invoked after component props were unloaded, this way you will be able to customize unloaded props of the element, for example setup a placeholder src to images:

```js
import LazyProps from "react-lazy-props";
...
 setPlaceholder(props, componentType){
  if(componentType === "img"){
   props.src = this.state.placeholder;
  }
 }
 return props;
}
...
render {
 return (
  <LazyProps onUnloadProps={(props, componentType)=> this.setPlaceholder(props, componentType)}>
...
```

**NOTE!** The function must always return props object.


### unloaded (boolean)

**Default:** `false` 

If set to true elements wont be unloaded, but observer still will be there, this approach will be more efficient because we will not have to loop through child elements and components unloading their props.  
The differecne is that you will have to set lazy props yourself:
```js
import LazyProps from "react-lazy-props";
...
return (
 <LazyProps unloaded={true}>
  <div>
   <h2 data-bg-src={backgroundImage}>Title</h2>
   <p>Some Images</p>
   <img data-src="example.jpg" />
   <video data-src="https://www.example.com/video.ogg" />
  </div>
 </LazyProps>
);
``` 


## IntersectionObserver polyfill
Since this package is observing elements with `IntersectionObserver`, if may want old browsers to support it with [IntersectionObserver polyfill](https://www.npmjs.com/package/intersection-observer)


## Credits
- [Lionix Team](https://github.com/lionix-team)
- [Stas Vartanyan](https://github.com/vaawebdev)