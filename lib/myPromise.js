(function (window) {
    function MyPromise(executor) {
        // 将当前 promise 对象保存起来，避免函数调用出现 this 指向问题
        const self = this

        self.status = "pending"
        self.data = undefined
        self.callbacks = []     // callbacks 数组元素：{onResolved(){},onRejected(){}}

        function resolve(value) {
            if (self.status !== "pending") {
                return
            }
            self.status = "resolved"
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
            if (self.status !== "pending") {
                return
            }
            self.status = "reject"
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
        self.callbacks.push({
            onResolved,
            onRejected
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
