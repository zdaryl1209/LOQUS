//this is mostly unneeded (since testing id done via thunderclient)

const whitelist = ['http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin)
        {
            callback(null, true);
        }
        else
        {
            callback(new Error('Not allowed due to CORS'));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;