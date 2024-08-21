const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
let ejs = require('ejs');

const app = express();

app.use("view-engine", "ejs");

app.use(bodyparser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    if (currentDay === 6 || currentDay === 0) {
        day = "Weekend";
    } else {
        day = "Weekday";
    }
    res.render("list", {kindOfDay: day});
});

app.listen(3000, function() {
    console.log('Server is running on port 3000');
});