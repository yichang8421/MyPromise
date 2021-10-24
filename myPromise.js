const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000)
})

const p2 = Promise.resolve(2)

const p3 = Promise.reject(3)

Promise
    .race([p1,p2,p3])
    // .race([p3, p2, p1])
    .then((value) => {
        console.log(`all sucess: ${value}`);
    })
    .catch((reason) => {
        console.log(`fail: ${reason}`);
    })