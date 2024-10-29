const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user ID
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>"

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            
            // Check if the error is due to token expiration
            if (err.name === 'TokenExpiredError') {
          
                return res.status(401).json({ message: 'Token expired' }); // Token has expired
            }
            return res.status(403).json({ message: 'Forbidden' }); // Forbidden for other errors
        }

        req.user = user; // Attach user object to request
        next();
    });
}

module.exports = authenticateToken;