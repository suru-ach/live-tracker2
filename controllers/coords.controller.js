const { Pool } = require('pg');
const clientInstance = new Pool({
    connectionString: process.env.CONNECTION_STRING_PG,
    ssl: {
        rejectUnauthorized: false
    }
});

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
    updatecoords
};
