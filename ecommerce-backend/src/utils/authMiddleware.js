const JWT = require("jsonwebtoken");
const { error } = require('../config/messages')

//JWT TOKEN
async function generateJWT(payloadDataObj) {
    try {
        return JWT.sign({ exp: Math.floor(Date.now() / 1000) + 24 * (60 * 60),  ...payloadDataObj }, process.env.JWT_SECRET);
    } catch (err) {
        console.log("Error while generateJWT ::: ", err)
        throw new Error(err)
    }
}

async function generateTokenJWT(payloadDataObj) {
    try {
        return JWT.sign({ data: payloadDataObj }, process.env.JWT_SECRET, {
            expiresIn: 3600 // 1 hour
        })
    } catch (err) {
        console.log("Error while generateTokenJWT ::: ", err)
        throw new Error(err)
    }
}

async function verifyTokenJWT(token) {
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        return decoded;
    } catch (err) {
        console.log("Error while verifyTokenJWT ::: ", err)
        throw new Error(error.TOKEN_EXPIRED)
    }
}

//VERIFY JWT TOKEN
async function verifyJWT(req, res, next) {
    try {
        let token = req.headers['x-access-token'] || req.headers.authorization;
        console.log('Auth header:', req.headers.authorization)

        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ').pop()
        }

        if (token) {
            let path = req.route.path.trim();
            path = path.slice(1, path.length);
            path = path.toLowerCase();

            JWT.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                try {
                    if (err) {
                        console.log('verifyJWT error ::: ', err);
                        throw (err)
                    }
                    let currentTimestamp = Math.floor(Date.now() / 1000)

                    if (currentTimestamp >= decoded.exp) {
                        return _handleResponse(req, res, { message: error.TOKEN_EXPIRED })
                    }
                    console.log(decoded.exp)

                    const { email, useruuid } = decoded;
                    req.decoded = { ...decoded, token };
                    req.user = decoded.data ? decoded.data : decoded;

                    if (req.body) {
                        req.body.userId = decoded.useruuid;
                    }
                    next();
                } catch (e) {
                    return _handleResponse(req, res, e)
                }
            })
        } else {
            return _handleResponse(req, res, { message: error.TOKEN_NOT_FOUND })
        }
    } catch (e) {
        console.log("ERROR : verifyJWT ::: ", e)
        return _handleResponse(req, res, e)
    }
}

async function authenticateJWT(req, res, next){
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })
  
    const token = authHeader.split(' ')[1]
  
    JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })
  
      req.user = user // userId and role from token
      next()
    })
  }

async function authorizeAdmin (req, res, next){
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  }

module.exports = {
    generateJWT,
    generateTokenJWT,
    verifyTokenJWT,
    verifyJWT,
    authenticateJWT,
    authorizeAdmin
}