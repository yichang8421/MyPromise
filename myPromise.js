// Promise api
// Promise.prototype.then()
// Promise.prototype.catch()
// Promise.all()
// Promise.race()

const p = new Promise((resolve, reject) => {
    console.log("执行eexcutor（执行器）");
    // executor 先执行，说明执行器函数是同步回调
    // executor 执行完毕，得到一个 promise 对象 p，同时开启异步任务
    setTimeout(() => {
        const m = Math.random();
        if (m > 0.5) {
            resolve(`成功了：m=${m}`)
        } else {
            reject(`失败了：m=${m}`)
        }
    }, 0)
})

console.log("执行其他任务");

// then 方法指定异步回调函数 resolve 和 reject
// 此时是在异步启动之后指定的回调，因此并不知道异步任务执行结果是成功还是失败
// 将计时器设置在 1s 以后，则可以确定此时异步任务的执行结果
// 即 Promise 可以允许先拿到异步任务执行结果，过一段时间再指定回调函数
setTimeout(() => {
    p.then((value) => {
        console.log(value)
    }).catch((reason) => {
        console.log(reason)
    })
}, 1000)