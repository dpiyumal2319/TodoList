const express = require('express');
const app = express();
const date = require(__dirname + "/date.js");

//Set the view engine to ejs
app.set("view engine", "ejs");

//Middleware to parse JSON bodies
app.use(express.json());

//Middleware to parse URL-encoded bodies
app.use(express.urlencoded( {extended: true} ));

//Added public repository to serve static files
app.use(express.static('public'));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get('/', function(req, res) {
    let day = date.getDay();  
    res.render("list", {kindOfDay: day, newListItems: items});
});

app.get('/work', function(req, res) {
    res.render("list", {kindOfDay: "Work List", newListItems: workItems});
});

app.post('/', function(req, res) {
    let item = req.body.newItem;

    if(req.body.button === "Work List") {
        workItems.push(item);
        res.redirect('/work');
    } else{
        items.push(item);
        res.redirect('/');
    }
})

app.get('/about', function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log('Server is running on port 3000');
});