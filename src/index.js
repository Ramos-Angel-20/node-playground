const express = require('express');
const app = express();

const PORT = 7070;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/netsuite.com/test', async (req, res) => {
  console.log(req.headers);
});

app.post('/', async (req, res) => {
  console.log(req.headers);
});



app.listen(PORT, () => {
  console.log(`RUNNING ON PORT ${PORT}`);
});