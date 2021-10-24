const p = new Promise((resolve, reject) => {
    console.log("执行excutor（执行器）");
    // setTimeout(()=>{
        const m = Math.random();
        if (m > 0.5) {
            resolve(`成功了：m=${m}`)
        } else {
            reject(`失败了：m=${m}`)
        }
    // },0)
})

console.log("执行其他任务");

p.then((value) => {
    console.log(value)
}, (reason) => {
    console.log(reason)
})