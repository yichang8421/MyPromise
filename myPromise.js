new Promise((resolve,reject)=>{
    resolve(1)
    // reject(1)
})
    .then(value => {
        console.log("onResolved1",value);
        // return 2
        // return Promise.resolve(2)
        // return Promise.reject(2)
        throw 2
    },reason => {
        console.log("onRejected1",reason);
        return "ok"
    })
    .then(value => {
        console.log("onResolved2",value);
    },reason => {
        console.log("onRejected2",reason);
    })