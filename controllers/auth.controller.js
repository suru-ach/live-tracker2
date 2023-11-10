const { Pool } = require('pg');

const clientInstance = new Pool({
    connectionString: process.env.CONNECTION_STRING_PG,
    ssl: {
        rejectUnauthorized: false
    }
});

const signup = (req, res) => {
    const { username, password, phonenumber } = req.body;

    if(!username || !password || !phonenumber) {
        return res.status(401).json({ data: "invalid details" });
    }

    return res.status(201).json({ data: req.body });
}

const login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(401).json({ data: "unauthorized, invalid username or password" });
    }

    const queryText = 'select * from "user"';
    let client;

    try {
        client = await clientInstance.connect();
        const result = await clientInstance.query(queryText);
        console.log(result.rows);
        return res.status(201).json({ data: result.rows[0] });
    }
    catch(err) {
        return res.status(500).json({ data: err });
    }
    finally {
        if(client) client.release();    
    }
}

const signout = (req, res) => {
    return res.status(201).json({ data: req.body });
}

module.exports = {
    signup,
    login,
    signout
}


