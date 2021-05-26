const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put ( '/:id', (req, res) => {
  const bookId = req.params.id;
  console.log( 'Book to update... ', bookId );

  let boolean = req.body.isRead;

  let queryText = '';

  if ( boolean === "true" ) {
    queryText = `UPDATE "books" SET "isRead"=true WHERE "books".id = $1;`;
  } 
  else {
    // If the direction is somehow not what we expect, we reject the response and send 
    // back a 500 error.
    res.sendStatus(500);
    return; // early exit since it's an error!
  }

  pool.query( queryText, [bookId] )
        .then( response => {
            console.log(response.rowCount);
            res.sendStatus(202);
        })
        .catch( err => {
            console.log('This is frustrating', err);
            res.sendStatus(500);
        });
})

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete ( '/:id', (req, res) => {
  // grab the id of the record to delete from the params ...
  itemToDelete = req.params.id;
  console.log( 'Book to delete: ', itemToDelete );

  const queryText = `DELETE FROM "books" WHERE "books".id = $1`

  pool.query( queryText, [itemToDelete] )
    .then( response => {
      console.log( 'Deleted book with ID# ', itemToDelete);
      res.send(200);
    }).catch( err => {
      console.log( 'Oops, you got an error!', err);
      res.sendStatus(500);
    })
})

module.exports = router;
