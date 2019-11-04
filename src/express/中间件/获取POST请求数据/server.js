const express=require('express');
const bodyParser=require('body-parser');

const app=express();

// create application/json parser
const jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/login', jsonParser, function (req, res) {
    console.log(req.body)
    res.send('welcome, ' + req.body.username)
})

app.listen(8080);