const express = require('express');

const app = express();

app.set("view engine", "ejs");

//Middleware to parse JSON bodies
app.use(express.json());

//Middleware to parse URL-encoded bodies
app.use(express.urlencoded( {extended: true} ));

//Added public repository to serve static files
app.use(express.static('public'));

var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];

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

app.get('/work', function(req, res) {
    res.render("list", {kindOfDay: "Work List", newListItems: workItems});
});

app.post('/', function(req, res) {
    let item = req.body.newItem;

    console.log(req.body.button);

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