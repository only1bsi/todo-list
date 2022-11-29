//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemSchema = {
  name: String
}

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({
  name:"Iphone 12 pro"
});

const Item2 = new Item({
  name:"the real game"
});

const Item3 = new Item({
  name:"the boss him self"
});

const defaultItems = [Item1, Item2, Item3,]

const listSchema={
  name:String,
  items:[itemSchema]
}

const List = mongoose.model("List", listSchema);

const items = []

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    
    if(foundItems.length === 0){ 
      Item.insertMany(defaultItems, function(err) {
        if(err){
          console.log(err);
        }else{
          console.log("sucssesful")
        }
      });
      res.redirect("/")
    }else{
      res.render
   ("list", {listTitle: "Today", newListItems: foundItems});  }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  });
item.save();
res.redirect("/") 
});
  
app.post("/delete", function(req, res){
  const checkedItem = req.body.checkbox;
  Item.findByIdAndRemove(checkedItem, function(err){
   if(!err){
    res.redirect("/")
   }
  });
});

app.get("/:pName", function(req, res){
  const createdName = req.params.pName;
  List.findOne({name:createdName}, function(err, foundIList){
    if(!err){
      if(!foundIList){
        const list = new List ({
          name: createdName,
          items: defaultItems 
        })
        list.save();
        res.redirect("/" + createdName);
      }else{
        res.render("list", {listTitle: foundIList.name, newListItems: foundIList.items});
      }
    }
  });

;


});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
