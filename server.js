const express = require('express');
const app = express();
const port = 2000;
app.use(express.static('client'));

app.listen(port, () => console.log(`Listening on https://localhost:${port}`));
