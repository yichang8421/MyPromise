(function (window) {
    const PENDING = "pending"
    const RESOLVED = "resolved"
    const REJECTED = "rejected"

    function MyPromise(executor) {
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

    MyPromise.prototype.then = function (onResolved, onRejected) {
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

    MyPromise.prototype.catch = function (onRejected) {
        // 执行只定义了错误回调的 then 方法
        // 同时返回 then 方法返回的结果（即新的 promise），以保证可以执行链式操作
        return this.then(undefined, onRejected)
    }

    MyPromise.resolve = function (value) {
        // resolve() 方法参数可以是 promise 也可以是非promise
        return new MyPromise((resolve, reject) => {
            if (value instanceof MyPromise) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }

    MyPromise.reject = function (reason) {
        // reject() 方法参数是reason
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }

    MyPromise.all = function (myPromises) {
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

    MyPromise.race = function (myPromises) {
        return new MyPromise((resolve, reject) => {
            myPromises.forEach(p => {
                // 参数数组可以有非promise元素
                MyPromise.resolve(p).then(resolve, reject)
            })
        })
    }
    window.MyPromise = MyPromise
})(window)