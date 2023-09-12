const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res) => {
    const {username, password} = req.body;

    //ensure that the username and the password were passed through successfully
    if (!username || !password)
    {
        return res.status(400).json({'message':'Username and Password are required'});
    };

    //search for a user with the same username in our DB. (There can only be one user with a particular username)
    const foundUser = await User.findOne({ username: username}).exec();

    if(!foundUser)
    {
        //return an unauthorised error code
        return res.sendStatus(401);
    }

    //compare the found user's password with that of the current user
    const confirmedDetailsCorrect = await bcrypt.compare(password, foundUser.password )
    if(!confirmedDetailsCorrect)
    {
        //return an unauthorised error code
        return res.sendStatus(401);;
    }

    //Get the users roles
    const roles = Object.values(foundUser.roles);

    // create JWTs
    // crete the access token (short lived)
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' } //this is 30 seconds for the purpose of this assignment/test to allow us to test properly (otherwise it would be around 15 minutes)
    );

    //create the refresh token to be saved in the db
    const refreshToken = jwt.sign(
        {"username": foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // send the refresh token as an http only cookie which would allow the user to refresh his access token.
    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24*60*60*1000}); // ideally this would also include secure: true. This has been omitted due to thunderClient
    res.json({ accessToken });
}

module.exports = { handleLogin };