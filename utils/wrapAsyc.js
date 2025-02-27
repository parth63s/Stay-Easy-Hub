module.exports = (fn) => {         // try catch block
    return function(req, res, next) {
        fn(req, res, next).catch(next)
    }
}