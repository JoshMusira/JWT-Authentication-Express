import express from 'express';
// import bodyParser from 'body-parser';
import config  from './src/db/config.js';
import todoRoutes from './src/routes/routes.js';
import jwt from 'jsonwebtoken';

const app = express();

//
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//jwt middleware
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});


// my-routes
todoRoutes(app);


app.get('/', (req, res) => {
    res.send("Hello😁 Welcome todo API!");
});

app.listen(config.port, () => {
    console.log(`Server is running on ${config.url}`);
});