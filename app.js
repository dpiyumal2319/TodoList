const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

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

const item3 = new Item({
    name: "Check the checkbox to delete an item.",
});

//Create a new schema for the custom list
const listSchema = {
    name: String,
    items: [items],
};
const List = mongoose.model("List", listSchema);

const defaultItems = [item1, item2, item3];

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

let day = date.getDay();

app.get("/", function (req, res) {
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
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.button;

    //Create a new document and saving to db
    const item = new Item({
        name: itemName,
    });

    if (listName === day) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then((list) => {
                if (!list) {
                    //Create a new list
                    const list = new List({
                        name: listName,
                        items: [item],
                    });
                }
                list.items.push(item);
                list.save();
                res.redirect(`/${listName}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

app.post("/deleteItem", (req, res) => {
    const checkedID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
        //Delete the item from the database
        Item.findByIdAndDelete(checkedID)
            .then((item) => {
                console.log(`Successfully deleted item: ${item.name}`);
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        List.findOneAndUpdate(
            {name : listName},
            {$pull: {items: {_id: checkedID}}}
        ).then((item) => {
            console.log(`Successfully deleted item from: ${item.name}`);
            res.redirect(`/${listName}`);
        }).catch((err) => {
            console.log(err);
        });
    }
});

//Dynamic route for a dynamic todo list
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    //Find the custom list in the database
    List.findOne({ name: customListName })
        .then((list) => {
            if (!list) {
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems,
                });

                list.save();
                res.redirect(`/${customListName}`);
            } else {
                res.render("list", {
                    kindOfDay: list.name,
                    newListItems: list.items,
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
