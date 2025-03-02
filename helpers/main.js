const uploadFile = require('./uploadImage')
const queryPromesa = require('./queryPromise')


module.exports = {
    ...uploadFile,
    ...queryPromesa
}