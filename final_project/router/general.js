const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (users[username]) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
  });
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 2)); // Formats the JSON output with 2-space indentation
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    return res.status(200).json(book);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if(filteredBooks.length > 0){
    return res.status(200).json(filteredBooks);
  }else{
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if(filteredBooks.length > 0){
    return res.status(200).json(filteredBooks);
  }else{
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book && book.reviews){
    return res.status(200).json(book.reviews);
  }else{
    return res.status(404).json({message: "No reviews available for this book"});
  }
});

module.exports.general = public_users;
