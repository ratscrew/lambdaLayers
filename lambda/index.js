const util = require('/opt/util')
const otherRepo = require('/opt/otherRepo')
const test = require('/opt/test')
exports.handler = async function () {
    console.log(otherRepo.test())
    console.log(test.now())
    return util.test()
    
}