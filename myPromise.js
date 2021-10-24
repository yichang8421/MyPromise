new Promise((resolve, reject) => {
    reject(1)
})
    .then(() => {
    })
    .then(() => {
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