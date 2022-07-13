const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const fs = require("fs");
const createError = require("http-errors");
const passport = require("passport");
const path = require("path");
const session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();
app.engine('hbs', exphbs({defaultLayout: false, extname:'.hbs',}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var userLogin = {};

app.get("/", (req, res) => {
    res.render("landing", {
        title:"landing",
    });
});


app.post("/api/login", (req, res) => {
    fs.readFile("./data.json", (err, data) => {
        var arr = [];
        if (err) {
            console.log(err);
        } else {
            if (data.toString()) {
                arr = JSON.parse(data.toString());
            }
            var s = arr.find((item) => {
                if (item.name == req.body.name) {
                    return item;
                }
            });
            if (s) {
                if (s.password == req.body.password) {
                    userLogin = req.body;
                    res.json({
                        status: "y",
                        meg: "login success",
                        data: s.name,
                    });
                } else {
                    res.json({
                        status: "err",
                        meg: "wrong password ",
                    });
                }
            } else {
                res.json({
                    status: "n",
                    meg: "no such user ",
                });
            }
        }
    });
});

app.get("/index", (req, res) => {
    if (userLogin.name) {
        fs.readFile('./books.json',function(err,data){
            if(err) {
                console.error(err);
            } else {
                var books = JSON.parse(data.toString());
                res.render("index", { username: userLogin.name, books: books });
            }
        }); 
    } else {
        res.render("login");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/logout", (req, res) => {
    res.render("login", {});
});

app.get("/quittolanding", (req, res) => {
    res.render("landing", {});
});

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.get('/books', (req, res) => {

    fs.readFile('./books.json', (err, data) => {
        if(err) {
            console.error(err);
        } else {
            let books = JSON.parse(data);
            res.json(books);
            res.end();
        }
    });
});

app.put("/borrow", (req, res) => {
    const books = req.body;

    let newdata = JSON.stringify(books, null, 2);

    fs.writeFileSync('./books.json', newdata);
    console.log('Data written to file');
    res.status(204).end();
});

app.put("/return", (req, res) => {
    const books = req.body;

    let newdata = JSON.stringify(books, null, 2);

    fs.writeFileSync('./books.json', newdata);
    console.log('Data written to file');
    res.status(204).end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on:`, port));