const p = new Promise((resolve, reject) => {
    setTimeout(()=>{
        const m = Math.random();
        if (m > 0.5) {
            resolve(`成功了：m=${m}`)
        } else {
            reject(`失败了：m=${m}`)
        }
    },0)
})

p.then((value) => {
    console.log(value)
}, (reason) => {
    console.log(reason)
})