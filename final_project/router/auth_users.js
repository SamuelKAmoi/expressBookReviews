const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
    req.session.token = token;
  
    return res.status(200).json({ message: "Login successful", token });
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.session.token;
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
  
    jwt.verify(token, "secret_key", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      }
  
      if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
      }
  
      const username = decoded.username;
      books[isbn].reviews = books[isbn].reviews || {};
      books[isbn].reviews[username] = review;
  
      return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
