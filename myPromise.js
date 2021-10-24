const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000)
})

const p2 = Promise.resolve(2)

const p3 = new Promise((resolve,reject)=>{
    throw new Error("出错了")
})

Promise
    .all([p1,p2,p3])
    // .race([p3, p2, p1])
    .then((value) => {
        console.log(`all sucess: ${value}`);
    })
    .catch((reason) => {
        console.log(`fail: ${reason}`);
    })