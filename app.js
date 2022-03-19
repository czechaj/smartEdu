const express = require('express');
const app = express();



app.get('/', (req,res) => {
    res.send('index page')
})



const port = 3000;
app.listen(port, () => {
  console.log(`application started on port ${port}`);
});
