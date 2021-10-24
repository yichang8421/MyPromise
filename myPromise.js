// 使用 promise 串联多个任务：
// 同步任务可以直接返回值
// 异步任务必须返回 promise 对象，获得状态之后才能使用 then 指定回调函数，最后异步执行回调

new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("执行任务1（异步）");
        resolve(1)
    }, 1000)
})
    .then(value => {
        console.log("执行成功：", value);
        console.log("执行任务2（同步）")
        return 2
    })
    .then(value => {
        console.log("执行成功：", value)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("执行任务3（异步）");
                resolve(3)
            }, 1000)
        })
    })
    .then(value => {
        console.log("执行成功：", value)
    })