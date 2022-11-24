function Promise(executor) {
    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.callbacks = []

    const that = this

    function resolve(data) {
        if (that.PromiseState !== 'pending') return
        that.PromiseState = 'fulfilled'
        that.PromiseResult = data
        that.callbacks.forEach((item) => {
            item.onResolved()
        })
    }

    function reject(data) {
        if (that.PromiseState !== 'pending') return
        that.PromiseState = 'rejected'
        that.PromiseResult = data
        that.callbacks.forEach((item) => {
            item.onRejected()
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
    function judgeState(fun, resolve, reject) {
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

    return new Promise((resolve, reject) => {
        if (this.PromiseState === 'fulfilled') {
            judgeState(onResolved, resolve, reject)
        }

        if (this.PromiseState === 'rejected') {
            judgeState(onRejected, resolve, reject)
        }

        if (this.PromiseState === 'pending') {
            this.callbacks.push({
                onResolved:  function() {
                    judgeState(onResolved, resolve, reject)
                },
                onRejected: function() {
                    judgeState(onRejected, resolve, reject)
                } 
            })
        }
    })


    
}