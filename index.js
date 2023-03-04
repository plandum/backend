const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./src/auth/authRouter');

const app = express();

app.use(express.json());
app.use(authRouter);

const port = 3001;

mongoose.connect(
  'mongodb+srv://Admin:Admin@ptodo.v5x3ms1.mongodb.net/?retryWrites=true&w=majority',
);

app.listen(port, () => console.log(`server started at port ${port}`));
