new Promise((resolve, reject) => {
    reject(1)
})
    .then(() => {
    })
    .then(() => {
    }, reason => {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    })
    .then(() => {
    }, reason => {
        throw reason
    })
    .then(() => {
    }, reason => {
        return Promise.reject(reason)
    })
    .catch(reason => {
        console.log("onRejected", reason);
    })
