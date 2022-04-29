require('dotenv').config();
const express = require("express");
const app = express();
const userRouter = require('./api/user/user.router');
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Mothod", "PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
    }
    next();
});


// app.get("/api", (req, res) => {
//     res.json({
//         success: 1,
//         message: 'This rest API is Working'
//     });
// });
app.use('/api/user', userRouter);

app.listen(process.env.APP_PORT, () => {
    console.log('Server-up and Running:', process.env.APP_PORT);
});