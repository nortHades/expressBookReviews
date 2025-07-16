const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if(username && password){
    // Check if the user does not already exist
    if (isValid(username)){
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "The username or password is missing, you cannot register!"});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
// });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
//  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const booksByAuthor  = Object.values(books).filter((book) =>
//     book.author.toLowerCase() === author.toLowerCase()
//   );

//   if(booksByAuthor.length > 0){
//     return res.status(200).json(booksByAuthor);
//   }else{
//     return res.status(404).json({message: "Unable to find book of the author."});
//   }
  
// });

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const booksByTitle = Object.values(books).filter((book)=>
//     book.title.toLowerCase() === title.toLowerCase()
//   );

//   if(booksByTitle.length > 0){
//     return res.status(200).json(booksByTitle);
//   }else{
//     return res.status(404).json({message: "Unable to find book of the title."});
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]){
    return res.status(200).json(books[isbn].reviews);
  }else
  {
    return res.status(404).json({message: "Unable to find the review of the book."});
  }
});



// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
      // Create a promise that resolves with the books data
      const getBooks = new Promise((resolve, reject) => {
          resolve(books);
      });
      
      // Wait for the promise to resolve and then send the data
      const allBooks = await getBooks;
      return res.status(200).json(allBooks);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching book list." });
  }
});


// Task 11: Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
      const getBookByISBN = new Promise((resolve, reject) => {
          const book = books[isbn];
          if (book) {
              resolve(book);
          } else {
              reject(new Error("Book not found for the provided ISBN."));
          }
      });

      const bookDetails = await getBookByISBN;
      return res.status(200).json(bookDetails);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
});


// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
      const getBooksByAuthor = new Promise((resolve, reject) => {
          const booksByAuthor = Object.values(books).filter(book =>
              book.author.toLowerCase() === author.toLowerCase()
          );

          if (booksByAuthor.length > 0) {
              resolve(booksByAuthor);
          } else {
              reject(new Error("No books found by this author."));
          }
      });
      
      const authorBooks = await getBooksByAuthor;
      return res.status(200).json(authorBooks);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
});


// Task 13: Get book details based on Title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
      const getBooksByTitle = new Promise((resolve, reject) => {
          const booksByTitle = Object.values(books).filter(book =>
              book.title.toLowerCase().includes(title.toLowerCase())
          );

          if (booksByTitle.length > 0) {
              resolve(booksByTitle);
          } else {
              reject(new Error("No books found with this title."));
          }
      });

      const titleBooks = await getBooksByTitle;
      return res.status(200).json(titleBooks);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
});



module.exports.general = public_users;
