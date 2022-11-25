function Promise(executor) {
    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.callbacks = []

    const that = this

    function resolve(data) {
        if (that.PromiseState !== 'pending') return
        that.PromiseState = 'fulfilled'
        that.PromiseResult = data
        queueMicrotask(() => {
            that.callbacks.forEach((item) => {
                item.onResolved()
            })
        })
    }

    function reject(data) {
        if (that.PromiseState !== 'pending') return
        that.PromiseState = 'rejected'
        that.PromiseResult = data
        queueMicrotask(() => {
            that.callbacks.forEach((item) => {
                item.onRejected()
            })
        })
    }

    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

Promise.prototype.then = function (onResolved, onRejected) {
    const that = this

    if(typeof onRejected !== 'function') {
        onRejected = err => {
            throw err
        }
    }

    if(typeof onResolved !== 'function') {
        onResolved = res => res
    }

    return new Promise((resolve, reject) => {
        function judgeState(fun) {
            try {
                const result = fun(that.PromiseResult)
                if (result instanceof Promise) {
                    result.then(res => {
                        resolve(res)
                    }, err => {
                        reject(err)
                    })
                } else {
                    resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        }
        if (this.PromiseState === 'fulfilled') {
            queueMicrotask(() => {
                judgeState(onResolved)
            })
        }

        if (this.PromiseState === 'rejected') {
            queueMicrotask(() => {
                judgeState(onRejected)
            })
        }

        if (this.PromiseState === 'pending') {
            this.callbacks.push({
                onResolved:  function() {
                    judgeState(onResolved)
                },
                onRejected: function() {
                    judgeState(onRejected)
                } 
            })
        }
    })
}

Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected)
}

Promise.resolve = function(data) {
    return new Promise((resolve, reject) => {
        if(data instanceof Promise) {
            data.then(res => {
                resolve(res)
            }, err => {
                reject(err)
            })
        }else {
            resolve(data)
        }
    })
}

Promise.reject = function(data) {
    return new Promise((resolve, reject) => {
        reject(data)
    })
}