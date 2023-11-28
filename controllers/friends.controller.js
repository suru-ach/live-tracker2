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
            where f.uid = $1 and f.fid = u.uid and f.isFriend = true\
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

};

const makeFriend = async (req, res) => {
    const { phonenumber } = req.payload;
    const { phonenumber: friendPhonenumber } = req.body;

    let client;
    try {
        client = await clientInstance.connect();
        const { rows: uid } = await clientInstance.query('select uid from "user" where phonenumber = $1', [phonenumber]);
        const { rows: fid } = await clientInstance.query('select uid from "user" where phonenumber = $1', [friendPhonenumber]);
        await clientInstance.query('insert into friends (uid, fid) values($1, $2)', [ uid[0].uid, fid[0].uid ]);
        return res.status(201).json({ data: 'yes' });
    }
    catch(err) {
        return res.status(403).json({});
    } finally {
        if(client)
            client.release();
    }
};

const removeFriend = async(req, res) => {
    const { phonenumber } = req.payload;
    const { phonenumber: friendPhonenumber } = req.body;

    let client
    try {
        client = await clientInstance.connect();
        const { rows: uid_rows } = await clientInstance.query('select uid from "user" where phonenumber = $1', [phonenumber]);
        const { rows: fid_rows } = await clientInstance.query('select uid from "user" where phonenumber = $1', [friendPhonenumber]);
        const { rows } = await clientInstance.query('delete from friends where (uid = $1 and fid = $2) or (uid = $2 and fid = $1)', [uid_rows[0].uid, fid_rows[0].uid]);
        console.log(rows);
        return res.status(200).json({ data: 'removed' });
    } catch(err) {
        return res.status(403).json({});
    } finally {
        if(client)
            client.release();
    }
}

const friendRequest = async (req, res) => {
    const { phonenumber } = req.payload;
    const { phonenumber: friendPhonenumber } = req.body;

    let client
    try {
        client = await clientInstance.connect();
        const { rows: uid_rows } = await clientInstance.query('select uid from "user" where phonenumber = $1', [phonenumber]);
        const { rows: fid_rows } = await clientInstance.query('select uid from "user" where phonenumber = $1', [friendPhonenumber]);
        const { rows } = await clientInstance.query('update friends set isfriend = true where (uid = $2 and fid = $1)', [uid_rows[0].uid, fid_rows[0].uid]);
        console.log(rows);
        return res.status(200).json({ data: 'added to friends list' });
    } catch(err) {
        return res.status(403).json({});
    } finally {
        if(client)
            client.release();
    }
}

module.exports = {
    getFriends,
    makeFriend,
    removeFriend,
    friendRequest
};
