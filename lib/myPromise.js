(function (window) {
    const PENDING = "pending"
    const RESOLVED = "resolved"
    const REJECT = "reject"

    function MyPromise(executor) {
        // 将当前 promise 对象保存起来，避免函数调用出现 this 指向问题
        const self = this

        self.status = PENDING
        self.data = undefined
        self.callbacks = []     // callbacks 数组元素：{onResolved(){},onRejected(){}}

        function resolve(value) {
            if (self.status !== PENDING) {
                return
            }
            self.status = RESOLVED
            self.data = value
            // 如果回调函数队列有回调函数，就异步执行回调函数
            if (self.callbacks.length > 0) {
                // 使用计时器保证将回调函数放入异步操作队列中执行
                setTimeout(() => {
                    self.callbacks.forEach(item => {
                        item.onResolved(value)
                    })
                })
            }
        }

        function reject(reason) {
            if (self.status !== PENDING) {
                return
            }
            self.status = REJECT
            self.data = reason
            // 如果回调函数队列有回调函数，就异步执行回调函数
            if (self.callbacks.length > 0) {
                // 使用计时器保证将回调函数放入异步操作队列中执行
                setTimeout(() => {
                    self.callbacks.forEach(item => {
                        item.onRejected(reason)
                    })
                })
            }
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    MyPromise.prototype.then = function (onResolved, onRejected) {

        // 当 onResolved 不是函数时，直接通过链式操作向后传递值
        onResolved = typeof onResolved === "function" ? onResolved : value => value
        // 实现异常传透。当 onRejected 不是函数时，将之前得到的异常再抛出去
        onRejected = typeof onRejected === "function" ? onRejected : reason => {
            throw reason
        }

        const self = this
        return new MyPromise((resolve, reject) => {

            function handle(callback) {
                // 1. 如果抛出异常，return 的 promise 就会失败，reason 就是error
                // 2. 如果回调函数返回值不是promise，return 的promise 就会成功，value就是返回的值
                // 3. 如果回调函数返回的是promise，return 的promise的结果就是这个promise的结果
                try {
                    const result = callback(self.data)
                    if (result instanceof MyPromise) {
                        // 3. 如果回调函数返回的是promise，return 的promise的结果就是这个promise的结果
                        // result.then(
                        //     value => resolve(value),
                        //     reason => reject(reason)
                        // )

                        result.then(resolve, reject)
                    } else {
                        // 2. 如果回调函数返回值不是promise，return 的promise 就会成功，value就是返回的值result
                        resolve(result)
                    }
                } catch (e) {
                    // 1. 如果抛出异常，return 的 promise 就会失败，reason 就是error
                    reject(e)
                }
            }

            if (this.status === PENDING) {
                // PENDING 状态下不仅要将回调函数压入回调队列，还要保证在执行回调函数时能够改变当前 promise 的状态
                // 因此，在压入回调队列的同时，还要添加修改状态的逻辑
                self.callbacks.push({
                    onResolved() {
                        handle(onResolved)
                    },
                    onRejected() {
                        handle(onRejected)
                    }
                })
            } else if (this.status === RESOLVED) {
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
        return this.then(undefined, onRejected)
    }
    MyPromise.resolve = function (value) {
        return new MyPromise((resolve, reject) => {
            if (value instanceof MyPromise) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }
    MyPromise.reject = function (reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
    MyPromise.all = function (myPromises) {
        // 保存所有成功的值
        const resolveValues = []

        return new MyPromise((resolve, reject) => {
            myPromises.forEach((p) => {
                p.then(
                    value => {
                        resolveValues.push(value)
                        if (resolveValues.length === myPromises.length) {
                            // 如果所有 promise 执行都为成功，则 return 的 promise 就为成功，成功的值为当前 promises
                            // 只有当保存成功返回值数组的长度恰好等于 promises 的长度，才能调用 resolve() 方法
                            resolve(resolveValues)
                        }
                    },
                    // 只要有一个失败，则 return 的 promise 为失败，值为当前失败的 reason
                    // 由于状态只能改变一次，因此即使之后还调用了 reject ，也返回第一个失败的 reason
                    reason => reject(reason)
                )
            })
        })
    };
    MyPromise.race = function (myPromises) {
    }
// 导出自定义 Promise
    window.MyPromise = MyPromise
})(window)