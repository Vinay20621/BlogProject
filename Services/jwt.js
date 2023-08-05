const jwt=require('jsonwebtoken')
const {TOKEN_SECRET}=require('../config/index')

 function signToken(payload, expiryTime){
    return  jwt.sign(payload, TOKEN_SECRET, {expiresIn: expiryTime});
}
function verifyToken(token){
    return jwt.verify(token, TOKEN_SECRET);
}
module.exports={signToken,verifyToken}