export const compose = (...fns) => {
    if(fns.length === 0){
        return (args) => args;
    } else if(fns.length === 1){
        return fns[0];
    } else {
        return fns.reduceRight((a, b) => 
            (...args) => b(a(...args))
        );
    }
}