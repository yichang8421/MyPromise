new Promise((resolve, reject) => {
    reject(1)
})
    .then(() => {
    })
    .then(() => {
    })
    .then(() => {
    })
    .then(() => {
    })
    .catch(reason => {
        console.log("onRejected", reason);
    })