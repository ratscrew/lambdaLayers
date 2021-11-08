const util = require('/opt/util')
const otherRepo = require('/opt/otherRepo')
exports.handler = async function (data) {
    console.log(otherRepo.test())
    return util.test()
    
}