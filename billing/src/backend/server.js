const express = require('express');
const cors = require('cors');
const app = express();

// Basic route handling
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.use(cors());

app.listen(5000, () => {
    console.log('Server running on port 5000');
});