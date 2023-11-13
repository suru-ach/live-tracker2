const getFriends = (req, res) => {
    return res.status(200).json({ data: 'yes' });
};

const makeFriend = (req, res) => {
    return res.status(200).json({ data: 'yes' });
};

module.exports = {
    getFriends,
    makeFriend
};
