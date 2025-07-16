const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username; 

   if (books[isbn]) {
    if (reviewText) {
        books[isbn].reviews[username] = reviewText;
        return res.status(200).json({
            message: `The review for the book with ISBN ${isbn} by user ${username} has been added/updated.`
        });
    } else {
        return res.status(400).json({ message: "No review text provided." });
    }
  } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // First, check if a book with the given ISBN exists.
  if (books[isbn]) {
      // Next, check if a review from this specific user exists for this book.
      if (books[isbn].reviews[username]) {
          // If the user's review exists, delete it from the reviews object.
          // The 'delete' operator removes a property from an object.
          delete books[isbn].reviews[username];
          
          // Send a success response.
          return res.status(200).json({ 
              message: `Review for the book with ISBN ${isbn} posted by ${username} has been deleted.` 
          });
      } else {
          // If no review by this user is found for this book, send a 404 error.
          return res.status(404).json({ 
              message: "No review found for this user on the specified book." 
          });
      }
  } else {
      // If the book itself is not found, send a 404 error.
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
