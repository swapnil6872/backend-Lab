const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname+'./public/index.html')
// })
app.post('/sum', (req, res) => {
    const { a, b } = req.body;
    const sum = Number(a) + Number(b);
    res.json({ sum });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
