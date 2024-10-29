import express from "express";
import cors from "cors";

let books = [
    { id: 1, name: "giborim", author: "dinn" },
    { id: 2, name: "alufim", author: "dinn" },
]
let bookCounter = 2;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    console.log("books before send",books);
    res.send(books);
});
app.get("/:id", (req, res) => {
    let id = req.params.id;
    let book = books.find(item => item.id == id);
    if (!book)
        res.status(404).send("book not found");
    res.send(book);
});
app.delete("/:id", (req, res) => {
    let initialLength=books.length;
    let id = req.params.id;
    books=books.filter(Boolean);
    console.log(books);
    books = books.filter(item => item.id != id);
    if (books.length < initialLength) {
        res.send(`Book ${id} deleted`);
    } else {
        res.status(404).send(`Book with ID ${id} not found`);
    }
});
app.put("/:id", (req, res) => {
    let id = req.params.id;
    let book = req.body;
    let index = books.findIndex(item => item.id == id);
    console.log("id",id);
    console.log("book",book);
    console.log("index",index);
    if (index !== -1){
        books[index] = book;
        res.send(`book ${id} updated`);
    }
    else
    res.status(400).send("could not update");
});
app.post("/", (req, res) => {
    console.log("req",req);

    let book = req.body;
    console.log("book",book);
    let newBook = {
        id: ++bookCounter,
        ...book
    }
    console.log("newBook",newBook);

    books.push(newBook);
    console.log("books",books);

    res.send(`book ${newBook.id} added`);
});

let port = 5000;

app.listen(port, ()=>{console.log(`app is listening on port ${port}`)})