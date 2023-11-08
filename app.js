require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT | 3000;

const authRouter = require('./router/auth.route.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authRouter);

const startServer = async () => {
    try {
        app.listen(port, () => { console.log(`listening on port ${port}`) });
    } catch (err) {
        console.log(err);
    }
}
startServer();
