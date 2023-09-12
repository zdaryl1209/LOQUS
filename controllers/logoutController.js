const User = require('../model/User');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    //ensure that the username and the password were passed through successfully
    if (!cookies?.jwt)
    {
        //No content
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if(!foundUser)
    {
        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204); //No content
    }

    //DELETE REFRESH TOKEN FROM DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    
    res.clearCookie('jwt', {httpOnly: true}); // ideally this would also include secure: true. This has been omitted due to thunderClient

    return res.sendStatus(204); //No content
}

module.exports = { handleLogout };