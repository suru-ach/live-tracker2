const { clientInstance } = require('../db/config.js');

class MapProvider {
    constructor(phonenumber, username) {
        this.phonenumber = phonenumber;
        this.username = username;
        this.isStalled = false;
        this.location = "";
        this.phoneList = [];
        this.currentCoords = [];
    }
};

const MapsOnline = new Map();

const startInstance = async (req, res) => {
    const { username, phonenumber } = req.payload; 
    
    
    if(MapsOnline[phonenumber] != null)
        return res.status(208);

    MapsOnline.set(phonenumber, new MapProvider(phonenumber, username)); 
    console.log(`${username} has started a room`);
    try {

    }
    catch(err) {

    }
    return res.status(201).send('ok');
}

const joinRoom = async (req, res) => {
    const { username, phonenumber } = req.payload;
    const { phonenumber: transmitterPhonenumber } = req.body;
    
    let client;
    try {
        client = await clientInstance.connect();
        const { rows: uid } = await clientInstance.query('select uid from "user" where phonenumber = $1', [phonenumber]);
        const { rows: fid } = await clientInstance.query('select uid from "user" where phonenumber = $1', [transmitterPhonenumber]);
        const { rows } = await clientInstance.query('select * from friends where (uid = $1 and fid = $2) or (uid = $2 and fid = $1)', [ uid[0].uid, fid[0].uid ]);
        if (rows[0].isfriend === true) {
            MapsOnline.get(transmitterPhonenumber).phoneList.push({ username, phonenumber });
            console.log(`${phonenumber} has joined ${transmitterPhonenumber}`);
            return res.status(202).send('ok'); 
        } else {
            return res.status(401).send('unauthorized');
        }
    }
    catch(err) {
        return res.status(500).send('db error'); 
    }
    finally {
        if(client)
            client.release();
    }
}

const tick = async (req, res) => {
    const { username, phonenumber } = req.payload; 
    const { x,y,isStalled,location } = req.body;

    if(MapsOnline.get(phonenumber) == null)
        return res.status(404).json({ data: 'no input' })

    MapsOnline.get(phonenumber).currentCoords = [x ,y];
    MapsOnline.get(phonenumber).isStalled = isStalled;
    MapsOnline.get(phonenumber).location = location;
    
    // save in db phonenumber,x,y,isStalled
    // const data = `${MapsOnline[phonenumber].currentCoords[0]}, ${MapsOnline[phonenumber].currentCoords[1]}`;
    const data = MapsOnline.get(phonenumber).currentCoords;
    return res.status(201).json({ data });
}

const termianteInstance = async(req, res) => {
    const { username, phonenumber } = req.payload; 
    MapsOnline[phonenumber] = null;
    console.log(`${username} has terminated the room`);
    return res.status(200).send('ok');
}

const getcoords2 = async (req, res) => {
    const { phonenumber: payload_phonenumber } = req.payload;
    const { phonenumber: requestedPhonenumber } = req.body; 

    if(MapsOnline.get(requestedPhonenumber) === undefined)
        return res.status(404).json({ data :MapsOnline.get(requestedPhonenumber) });


    /*
    const exists = MapsOnline.get(requestedPhonenumber).phoneList.some(({ username, phonenumber }) => {
        phonenumber === payload_phonenumber
    });

    if(!exists)
        return res.status(401).send('not in list');
    */

    const [x ,y] = [...MapsOnline.get(requestedPhonenumber).currentCoords];
    return res.status(200).json({ x, y, isStalled: false, location: ""});
}

const getcoords = async (req, res) => {
    try {
        const { rid } = req.body;
        const result = await clientInstance.query('select * from coords where rid = $1', [rid]);
        const data = result.rows;
        return res.status(200).json({ data });    
    }
    catch(err) {
        return res.status(400).json({ data: err });
    }
}

const updatecoords = async (req, res) => {
    try {
        const { rid, x, y , count } = req.body;
        const queryText = 'insert into coords (rid, x, y, ping_no) values ($1, $2, $3, $4)';
        const queryParams = [rid, x, y, count];
        const updatedresult = await clientInstance.query(queryText, queryParams);
        return res.status(201).json({ data: updatedresult });
    }
    catch(err) {
        return res.status(400).json({ data: err });
    }
}

module.exports = {
    getcoords,
    updatecoords,
    startInstance,
    tick,
    joinRoom,
    termianteInstance,
    getcoords2
};
