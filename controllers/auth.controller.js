const signup = (req, res) => {
    const { username, password, phonenumber } = req.body;

    if(!username || !password || !phonenumber) {
        return res.status(401).json({ data: "invalid details" });
    }
    return res.status(201).json({ data: req.body });
}

const login = (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(401).json({ data: "unauthorized, invalid username or password" });
    }
    return res.status(201).json({ data: req.body });
}

const signout = (req, res) => {
    return res.status(201).json({ data: req.body });
}

module.exports = {
    signup,
    login,
    signout
}
