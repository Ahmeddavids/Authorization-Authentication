const express = require('express');
require('./database/database')
const userRouter = require('./routes/userRouter')

const PORT = 8000;

const app = express();
app.use(express.json());
app.use(userRouter)

app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`);
})
