let jwt = require('jsonwebtoken')

module.exports.verifyToken = function(req, res, next){
    var bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secretkey', (err, result) => {
            if(err){
                res.sendStatus(403);
            }
            next();
        })
    } else {
        res.sendStatus(403);
    }

}