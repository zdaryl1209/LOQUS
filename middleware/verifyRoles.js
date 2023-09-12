//Ensure that the correct role is assigned to whoever is trying to execute certain tasks.
const verifyRoles = (...allowedRoles) => 
{
    return (req, res, next) => {
        if (!req?.roles)
        {
            return res.sendStatus(401); 
        }

        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(r => r == true);

        if(!result)
        {
            res.sendStatus(401); //Unauthorised
        }

        next();
    }
}

module.exports = verifyRoles;