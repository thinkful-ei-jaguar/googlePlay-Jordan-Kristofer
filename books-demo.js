const express = require('express');
const morgan = require('morgan');

const bookData = require('./bookData');

const app = express();
app.use(morgan('dev'));

app.get('/books', (req, res) => {
  let filteredBooks = [...bookData];

  if('search' in req.query && !req.query.search){
    return res.status(400).json({error: 'Search must contain a value'});
  }

  if (req.query.search){
    const lowerSearch = req.query.search.toLowerCase();
    filteredBooks = filteredBooks.filter(book => book.title.toLowerCase().includes(lowerSearch));
  }

  if (req.query.sort){
    if (req.query.sort !== 'title' && req.query.sort !== 'title'){
      return res.status(400).json({error: 'Sort must be set to "title" or "rank"'});
    }

    filteredBooks.sort((a, b) => {
      // 1 | -1 to reverse the order || 0 to leave it where it is 
      //use bracket notation to handle dynamic data - we do not know if sort will be by title or by rank
      return a[req.query.sort] < b[req.query.sort]? -1 : 1;
    });
  }

  res.json(filteredBooks);
});

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on PORT 8000');
});