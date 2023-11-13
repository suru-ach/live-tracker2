const { sign, verify, TokenExpiredError } = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    return sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '1min' });
}

const generateRefreshToken = (payload) => {
    return sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '1d' });
}

const verifyToken = async (req, res, next) => {
    const authorizationString = req.cookies.access_token;

    if(!authorizationString)
        return res.status(401).json({ data: 'not authorized'});

    let payload;
    try {
        req.payload = verify(authorizationString, process.env.ACCESS_TOKEN);
    } catch(err) {
        if(err instanceof TokenExpiredError) {
            const refreshString = req.cookies.refresh_token;
            payload = verifyRefreshToken(refreshString);
            if(!refreshString)
                return res.status(401).json({ data: "Unauthorized access invalid payload" });
            else
                return res.status(401).json({ data: "Unauthorized access payload" });
        }
        return res.status(401).json({ data: "Unauthorized access" });
    }
    next();
}

const verifyRefreshToken = (authorizationString) => {
    try {
        return verify(authorizationString, process.env.REFRESH_TOKEN);
    }
    catch(err) {
        return false;
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
};
