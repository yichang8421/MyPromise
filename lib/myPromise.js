(function (window) {
    const PENDING = "pending"
    const RESOLVED = "resolved"
    const REJECTED = "rejected"

    class MyPromise {
        constructor(executor) {
            const self = this
            self.status = PENDING
            self.data = undefined
            self.callback = [] // item: {onResolved(),onRejected()}

            function resolev(value) {
                setTimeout(() => {
                    if (self.status !== PENDING) {
                        return
                    }
                    self.status = RESOLVED
                    self.data = value
                    if (self.callback.length > 0) {
                        self.callback.forEach(item => {
                            item.onResolved(self.data)
                        })
                    }
                })
            }

            function reject(value) {
                setTimeout(() => {
                    if (self.status !== PENDING) {
                        return
                    }
                    self.status = REJECTED
                    self.data = value
                    if (self.callback.length > 0) {
                        self.callback.forEach(item => {
                            item.onRejected(self.data)
                        })
                    }
                })
            }

            try {
                executor(resolev, reject)
            } catch (e) {
                reject(e)
            }
        }

        then(onResolved, onRejected) {
            const self = this

            // 实现RESOLVED传透。是函数就按函数定义来；不是函数，就往外传得到的数据
            onResolved = typeof onResolved === "function" ? onResolved : value => value
            // 实现REJECTED传透。是函数就按函数定义来；不是函数，就往外抛得到的错误
            onRejected = typeof onRejected === "function" ? onRejected : reason => {
                throw reason
            }

            return new MyPromise((resolve, reject) => {

                function handle(callback) {
                    try {
                        const result = callback(self.data)
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject)
                        } else {
                            resolve(result)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }

                if (self.status === PENDING) {
                    self.callback.push({
                        // PENDING 状态时，不仅要将回调函数存入callback数组，还有修改对应promise的状态
                        // 此时，只是保存回调函数，并没有放入微任务队列中
                        // 具体什么时候将回调函数放入微队列执行，要根据promise执行器执行结果状态来决定

                        /* 放入微队列执行的必要条件：1.promise的状态发生改变；2.指定了回调函数 */

                        onResolved() {
                            handle(onResolved)
                        },
                        onRejected() {
                            handle(onRejected)
                        }
                    })
                } else if (self.status === RESOLVED) {
                    setTimeout(() => {
                        handle(onResolved)
                    })
                } else {
                    setTimeout(() => {
                        handle(onRejected)
                    })
                }
            })
        }

        catch(onRejected) {
            // 执行只定义了错误回调的 then 方法
            // 同时返回 then 方法返回的结果（即新的 promise），以保证可以执行链式操作
            return this.then(undefined, onRejected)
        }

        static resolve = function (value) {
            // resolve() 方法参数可以是 promise 也可以是非promise
            return new MyPromise((resolve, reject) => {
                if (value instanceof MyPromise) {
                    value.then(resolve, reject)
                } else {
                    resolve(value)
                }
            })
        }

        static reject = function (reason) {
            // reject() 方法参数是reason
            return new MyPromise((resolve, reject) => {
                reject(reason)
            })
        }

        static resolveDelay = function (value, time) {
            return new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    if (value instanceof MyPromise) {
                        value.then(resolve, reject)
                    } else {
                        resolve(value)
                    }
                }, time)
            })
        }

        static rejectDelay = function (reason, time) {
            return new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    reject(reason)
                }, time)
            })
        }

        static all = function (myPromises) {
            return new MyPromise((resolve, reject) => {
                // 存储成功的值
                const resolveValue = new Array(myPromises.length)
                // 对成功计数
                let resolveCount = 0

                // 创建成功值数组不能使用push方法，push方法可能会打乱原始顺序
                myPromises.forEach((p, index) => {
                    // 传入参数数组的元素可以不为promise，此时，将p包装成promise
                    MyPromise.resolve(p).then(
                        value => {
                            resolveCount += 1
                            resolveValue[index] = value
                            if (resolveCount === myPromises.length) {
                                resolve(resolveValue)
                            }
                        },
                        reject
                    )
                })
            })
        }

        static race = function (myPromises) {
            return new MyPromise((resolve, reject) => {
                myPromises.forEach(p => {
                    // 参数数组可以有非promise元素
                    MyPromise.resolve(p).then(resolve, reject)
                })
            })
        }
    }

    window.MyPromise = MyPromise
})(window)