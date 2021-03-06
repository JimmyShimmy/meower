const express = require('express');
const path = require('path');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");

const app = express();

const port = process.env.PORT || 5000;

if (process.env.PORT) {
    const db = monk(process.env.MONGO_URI);
} else {
    const db = monk('localhost/meower');
}

console.log({port,db});

const mews = db.get('mews');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 per minute
    max: 1
});



app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    console.log("am I sending the file");
    //res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/mews', (req, res) => {
    console.log('we hit the mews endpoint');
    res.json(["test"]);
    /*

    mews
        .find()
        .then(mews => {
            res.json(mews);
        });

    */
});

app.use(apiLimiter);

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
        mew.content && mew.content.toString().trim() !== '';
}

app.post('/mews', (req, res) => {
    if(isValidMew(req.body)){
        console.log(req.body);
        const mew = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });
    } else {
        res.status(422);
        res.json({
            message: 'content and name are required'
        });
    }
});

app.listen(port, () => {
    console.log("listening on port " + port);
});