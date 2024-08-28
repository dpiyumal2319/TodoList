const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

//Set the view engine to ejs
app.set("view engine", "ejs");

//Middleware to parse JSON bodies
app.use(express.json());

//Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Added public repository to serve static files
app.use(express.static("public"));

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB");

//Create a new schema
const items = new mongoose.Schema({
    name: String,
});

//Create a new model
const Item = mongoose.model("Item", items);

//Create a new document
const item1 = new Item({
    name: "Welcome to your todolist!",
});

const item2 = new Item({
    name: "Hit the + button to add a new item.",
});

const defaultItems = [item1, item2];

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function (req, res) {
    let day = date.getDay();

    //Find all items in the database
    Item.find({})
        .then((items) => {
            if (items.length === 0) {
                //Insert the default items into the database
                Item.insertMany(defaultItems)
                    .then(function () {
                        console.log("Successfully inserted default items");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                res.redirect("/");
            } else {
                res.render("list", { kindOfDay: day, newListItems: items });
            }
        }).catch ((err) => {
            console.log(err);
        });
});

app.get("/work", function (req, res) {
    res.render("list", { kindOfDay: "Work List", newListItems: workItems });
});

app.post("/", function (req, res) {
    let item = req.body.newItem;

    if (req.body.button === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
