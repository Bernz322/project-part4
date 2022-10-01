const { sign, verify } = require('jsonwebtoken');

/**
 * Sign token with JWT using user's email and id
 * @param {Object} user 
 * @returns signed JWT token
 */

const createToken = (user) => {
    return accessToken = sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET); // Create Token using username and id
};

/**
 * Middleware for verifying token sent with the request to access the api controller
 */
const validateToken = async (req, res, next) => {
    let token;

    // If we can see a req.headers.authorization with 'Bearer' in the request
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // req.headers.authorization looks like Bearer <the token>, so we split it and take the token only.
            token = req.headers.authorization.split(' ')[1];

            // Validate token
            const decoded = verify(token, process.env.JWT_SECRET);

            // The decoded token which contains user email and id
            req.user = decoded;

            if (decoded) return next(); // End of the middleware and continue
        } catch (error) {
            // If something goes wrong, return 403 meaning, token is invalid 
            res.status(403).json({ message: "Expired or Invalid Token received. Please re-login." });
        }
    }
    // If no  req.headers.authorization with 'Bearer' in the request return no token
    if (!token) return res.status(401).json({ message: "You don't have a token. Please login properly." }); // If no token, return 401
};

module.exports = { createToken, validateToken };