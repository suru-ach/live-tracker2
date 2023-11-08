const signup = (req, res) => {
    return res.status(201).json({ data: req.body });
}

const login = (req, res) => {
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
