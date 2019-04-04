const express = require('express');
const app = express();

const { init, initCollections } = require('./db');
const Router = require('./router');

app.use('/api', Router);

(async function () {
    await init();
    await initCollections();

    app.listen(process.env.PORT, () => {
        console.log(`Service started at port: ${process.env.PORT}`)
    });
}());


