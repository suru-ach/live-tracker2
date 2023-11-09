require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT | 3000;

const authRouter = require('./router/auth.route.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.route('/healthz', (req, res) => res.status(200).send('safe'));
app.use(authRouter);

const server = app.listen(port, () => { console.log(`listening on port ${port}`) });

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
