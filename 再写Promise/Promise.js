function Promise(executor) {
    this.PromiseState = 'pending'
    this.PromiseResult = null
    this.callbacks = []

    const that = this

    function resolve(data) {
        if(that.PromiseState !== 'pending') return 
        that.PromiseState = 'fulfilled'
        that.PromiseResult = data
        that.callbacks.forEach((item) => {
            item.onResolved(data)
        })
    }

    function reject(data) {
        if(that.PromiseState !== 'pending') return 
        that.PromiseState = 'rejected'
        that.PromiseResult = data
        that.callbacks.forEach((item) => {
            item.onRejected(data)
        })
    }

    try {
        executor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}

Promise.prototype.then = function(onResolved, onRejected) {
    if(this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult)
    }

    if(this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult)
    }

    if(this.PromiseState === 'pending') {
        this.callbacks.push({onResolved, onRejected})
    }
}