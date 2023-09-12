const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    //ensure that the username and the password were passed through successfully
    if (!cookies?.jwt)
    {
        // Unauthorised
        return res.sendStatus(401); 
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if(!foundUser)
    {
        //return a forbidden error code
        console.log("User not found")
        return res.sendStatus(403);
    }

    // evaluate JWT to ensure that a logged in user with the correct role is being used
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username != decoded.username)
            {
                //Forbidden
                return res.sendStatus(403);
            }

            //Get the users roles
            const roles = Object.values(foundUser.roles);

            console.log(roles);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({ accessToken});
        }
    );
}

module.exports = { handleRefreshToken };