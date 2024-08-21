const express = require('express');

const app = express();

app.set("view engine", "ejs");

//Middleware to parse JSON bodies
app.use(express.json());

//Middleware to parse URL-encoded bodies
app.use(express.urlencoded( {extended: true} ));

var items = ["Buy Food", "Cook Food", "Eat Food"];

app.get('/', function(req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    
    res.render("list", {kindOfDay: day, newListItems: items});
});

app.post('/', function(req, res) {
    item = req.body.newItem;
    items.push(item);
    res.redirect('/');
})

app.listen(3000, function() {
    console.log('Server is running on port 3000');
});