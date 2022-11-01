function type(item) {
    if (Array.isArray(item)) return 'array'
    if (~item.toString().indexOf('object')) return 'object'
    return 'default'
}

function cloneObj(obj) {
    return Object.keys(obj).reduce((pre, key) => {
        switch (type(obj[key])) {
            case 'default':
                pre[key] = obj[key]
                break;
            default:
                pre[key] = _deepClone(obj[key])
        }
        return pre
    }, {})
}

function cloneArr(arr) {
    return arr.reduce((pre, item) => {
        switch (type(item)) {
            case 'array':
                pre.push(_deepClone(item))
                break;
            case 'object':
                pre.push(cloneObj(item))
                break;
            default:
                pre.push(item)
        }
        return pre
    }, [])
}

function _deepClone(item) {
    switch (type(item)) {
        case 'array':
            return cloneArr(item)
            break;
        case 'object':
            return cloneObj(item)
            break;
        default:
            console.log('你传入的不是对象')
    }

}

const arr1 = [1, [2, 3], { a: 4, b: 5 }]
const arr2 = _deepClone(arr1)

console.log(arr1)
console.log(arr2)
console.log(arr1[2] === arr2[2])

console.log('------------')

const obj1 = { a: 1, b: [2, 3], c: { d: 4 } }
const obj2 = _deepClone(obj1)
console.log(obj1)
console.log(obj2)
console.log(obj1.b === obj2.b)

