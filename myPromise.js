new Promise((resolve, reject) => {
    reject(1)
})
    .then(() => {
    }, reason => {
        throw reason
    })
    .then(() => {
    }, reason => {
        throw reason
    })
    .then(() => {
    }, reason => {
        throw reason
    })
    .then(() => {
    }, reason => {
        throw reason
    })
    .catch(reason => {
        console.log("onRejected", reason);
    })