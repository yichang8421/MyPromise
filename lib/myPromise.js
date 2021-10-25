(function (window) {
    function MyPromise(executor) {
        this.status = "pending"
        this.data = undefined
        this.callbacks = []     // callbacks 数组元素：{onResolved(){},onRejected(){}}

        function resolve(value) {
            if (this.status !== "pending") {
                return
            }
            this.status = "resolved"
            this.data = value
            // 如果回调函数队列有回调函数，就异步执行回调函数
            if (this.callbacks.length > 0) {
                // 使用计时器保证将回调函数放入异步操作队列中执行
                setTimeout(() => {
                    this.callbacks.forEach(item => {
                        item.onResolved(value)
                    })
                })
            }
        }

        function reject(reason) {
            if (this.status !== "pending") {
                return
            }
            this.status = "reject"
            this.data = reason
            // 如果回调函数队列有回调函数，就异步执行回调函数
            if (this.callbacks.length > 0) {
                // 使用计时器保证将回调函数放入异步操作队列中执行
                setTimeout(() => {
                    this.callbacks.forEach(item => {
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
        this.callbacks.push({
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
