const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const {username, password} = req.body;


    //ensure that the username and the password were passed through successfully
    if (!username || !password)
    {
        return res.status(400).json({'message':'Username and Password are required'});
    };

    //check for duplicates
    const duplicate = await User.findOne({ username: username}).exec();

    if(duplicate)
    {
        //return a conflict error code
        return res.sendStatus(409);
    }

    try
    {
        //first encrypt the password
        const hashedPass = await bcrypt.hash(password, 10);

        //create the user to be saved to the DB and add it to MongoDB
        const newUser = await User.create({
            "username": username,
            "password": hashedPass
        });
        
        res.status(201).json({ success: `New User ${username} Created` });
    }
    catch (err)
    {
        res.status(500).json({'message': err.message});
    }
}

module.exports = { handleNewUser };