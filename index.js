const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./users/router");
const loginRouter = require("./auth/router");

const app = express();
const port = process.env.PORT || 4000;

const corsMiddleware = cors();
const parserMiddleware = bodyParser.json();
app.use(corsMiddleware, parserMiddleware);
app.use(userRouter);
app.use(loginRouter);

app.listen(port, () => console.log(`App listening to port ${port}`));
