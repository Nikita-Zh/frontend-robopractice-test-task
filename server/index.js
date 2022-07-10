const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');

app.use(cors({origin: 'http://localhost:3000'}));

app.get('/api/users', (req, res) => {
    res.send(
        require('./data.json')
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
