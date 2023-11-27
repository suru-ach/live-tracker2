const { clientInstance } = require('../db/config.js');

const getFriends = async (req, res) => {
    const { username, phonenumber } = req.payload;

    let client;
    try {
        client = await clientInstance.connect(); 
        const { rows: uid_arr } = await clientInstance.query('select uid from "user" where phonenumber = $1', [phonenumber]);
        const { uid } = uid_arr[0];
        const sqlText = '\
            select u.username, u.phonenumber, f.isFriend \
            from friends as f, "user" as u \
            where f.uid = $1 and f.fid = u.uid \
            union \
            select u.username, u.phonenumber, f.isFriend \
            from friends as f, "user" as u \
            where f.fid = $1 and f.uid = u.uid \
        ';
        const { rows: result } = await clientInstance.query(sqlText, [uid]);
        return res.status(200).json({ data: result });
    } catch(err) {
        return res.status(400).json({});
    } finally {
        if(client)
             client.release();
    }

    return res.status(200).json({ data: 'yes' });
};

const makeFriend = (req, res) => {
    return res.status(200).json({ data: 'yes' });
};

module.exports = {
    getFriends,
    makeFriend
};
