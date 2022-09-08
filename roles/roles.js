const AccessControl = require('accesscontrol')
const ac = new AccessControl()


exports.roles = (()=>{

    ac.grant("BasicUser")
    .updateAny('book',['rate'])
    

    ac.grant("AdminUser")
    .readAny('profile')
    .updateAny("profile")
    .deleteAny("profile")
    
    .createAny("book")
    .updateAny("book")
    .deleteAny("book")
    
    return ac;
})();