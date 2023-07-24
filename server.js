const express = require('express');
require('./database/database')
const userRouter = require('./routes/userRouter')
const recordRouter = require('./routes/recordRouter')

const PORT = 8000;

const app = express();
app.use(express.json());
app.use('/api', userRouter)
app.use('/api', recordRouter)

app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`);
})
