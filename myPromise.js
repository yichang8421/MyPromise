new Promise((resolve, reject) => {
    reject(1)
})
    .then(() => {
    })
    .then(() => {
    }, reason => {
        // 返回一个状态为 padding 的 promise 对象，则由于状态不确定，回调函数无法触发执行。
        // promise 链在此处被中断
        return new Promise(()=>{})
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
