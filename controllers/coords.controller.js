const getcoords = (req, res) => {
    return res.status(200).json({ data: 'yes' });    
}

const updatecoords = (req, res) => {
    return res.status(200).json({ data: req.body });
}

module.exports = {
    getcoords,
    updatecoords
};
