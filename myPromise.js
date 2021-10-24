new Promise((resolve,reject)=>{
    // resolve(1)
    reject(1)
})
    .then(value => {
        console.log("onResolved1",value);
        return "ok"
    },reason => {
        console.log("onRejected1",reason);
        return "fail"
    })
    .then(value => {
        console.log("onResolved2",value);
    },reason => {
        console.log("onRejected2",reason);
    })