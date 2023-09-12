const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer '))
    {
        // Unauthorised
        return res.sendStatus(401);
    }

    //the authHeader would look like "Bearer ew8ifhoq8347"
    //the split is there to extract the second part after the whitespace
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err)
            {
                // Forbidden
                return res.sendStatus(403);
            }

            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT;