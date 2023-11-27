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

    MapsOnline[phonenumber] = new MapProvider(phonenumber, username); 
    try {

    }
    catch(err) {

    }
    return res.status(201).send('ok');
}

const joinRoom = async (req, res) => {
    const { username, phonenumber } = req.payload;
    const { transmitterPhonenumber } = req.body;
    
    if(MapsOnline[transmitterPhonenumber] != null)
        return res.status(204);

    MapsOnline[transmitterPhonenumber].phoneList.push({ username, phonenumber });
    return res.status(202); 
}

const tick = async (req, res) => {
    const { username, phonenumber } = req.payload; 
    const { x,y,isStalled,location } = req.body;

    console.log(req.body);
    
    MapsOnline[phonenumber].currentCoords = [x ,y];
    MapsOnline[phonenumber].isStalled = isStalled;
    MapsOnline[phonenumber].location = location;

    // save in db phonenumber,x,y,isStalled
    const data = `${MapsOnline[phonenumber].currentCoords[0]}, ${MapsOnline[phonenumber].currentCoords[1]}`;
    return res.status(201).send(data);
}

const termianteInstance = async(req, res) => {
    const { phonenumber } = req.payload; 
    MapsOnline[phonenumber] = null;
    return res.status(200).send('ok');
}

const getcoords2 = async (req, res) => {
    const { requestedPhonenumber } = req.body; 
    
    const [x ,y] = [...MapsOnline[requestedPhonenumber].currentCoords];
    return res.status(200).json({ x, y });
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
