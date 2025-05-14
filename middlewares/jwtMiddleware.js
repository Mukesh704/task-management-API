const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if(!authorization) return res.status(401).json({error: 'Token not found'});

        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(401).json({
                error: 'Unauthorized'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            error: 'Invalid token'
        })
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: 30000});
}

module.exports = {
    jwtMiddleware,
    generateToken
}