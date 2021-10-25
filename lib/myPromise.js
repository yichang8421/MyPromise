(function (window) {
    function MyPromise(executor) {

    }

// 导出自定义 Promise
    window.MyPromise = MyPromise

    MyPromise.prototype.then = function (onResolved, onRejected) {
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
})(window)
