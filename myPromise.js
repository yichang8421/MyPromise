const p1 = new Promise((resolve, reject) => {
    resolve(1);
})

const p2 = Promise.resolve(2)

const p3 = Promise.reject(3)

Promise
    // .all([p1, p2, p3])
    .all([p1,p2])
    .then((values) => {
        console.log(`all sucess: ${values}`);
    })
    .catch((reason) => {
        console.log(`fail: ${reason}`);
    })