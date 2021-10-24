// 先指定回调函数，再执行回调
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)  // 改变 promise 的状态，同时异步执行回调
    }, 1000)
}).then((value) => {    // 先指定回调函数，promise 状态此时不清楚，因此将回调函数保存起来
    console.log("onResolved1", value);
}, (reason) => {
    console.log("onRejected1", reason);
})


// 先改变 promise 对象的状态，再指定回调函数
new Promise((resolve, reject) => {
    resolve(1)      // 先改变 promise 状态，指定回调参数
}).then((value) => {    // 然后指定回调函数，同时异步执行回调函数
    console.log("onResolved2", value);
}, (reason) => {
    console.log("onRejected2", reason);
})


// 先改变 promise 对象的状态，再指定回调函数
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)  // 改变 promise 的状态，指定回调参数
    }, 1000)
})

setTimeout(() => {  // 等 promise 状态改变之后，指定回调函数，同时异步执行回调函数
    p.then((value) => {
        console.log("onResolved3", value);
    }, (reason) => {
        console.log("onRejected3", reason);
    })
}, 1100)