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
        const self = this
        return new MyPromise((resolve, reject) => {
            if (this.status === PENDING) {
                self.callbacks.push({
                    onResolved,
                    onRejected
                })
            } else if (this.status === RESOLVED) {
                setTimeout(() => {
                    // 1. 如果抛出异常，return 的 promise 就会失败，reason 就是error
                    // 2. 如果回调函数返回值不是promise，return 的promise 就会成功，value就是返回的值
                    // 3. 如果回调函数返回的是promise，return 的promise的结果就是这个promise的结果
                    try {
                        const result = onResolved(self.data)
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
                })
            } else {
                setTimeout(() => {
                    try {
                        const result = onRejected(self.data)
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject)
                        } else {
                            resolve(result)
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
    }

    MyPromise.prototype.catch = function (onRejected) {
    }
    MyPromise.resolve = function (value) {
    }
    MyPromise.reject = function (reason) {
    }
    MyPromise.all = function (myPromises) {
    }
    MyPromise.race = function (myPromises) {
    }
// 导出自定义 Promise
    window.MyPromise = MyPromise
})(window)