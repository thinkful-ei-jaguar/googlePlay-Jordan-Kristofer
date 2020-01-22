const express = require('express');
const morgan = require('morgan');

const appData = require('./playstore.js');

const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  let filteredApps = [...appData];

  const { sort, genres } = req.query;

  if(!sort && !genres){
    return appData;
  }

  const acceptedGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];


  if (req.query.genres){
    if(!acceptedGenres.includes(genres)){
      return res.status(400).json({error: 'Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, Card'});
    }
    
    const lowerGenres = req.query.genres.toLowerCase();
    filteredApps = filteredApps.filter(app => app.genres.toLowerCase().includes(lowerGenres));
  }

  if (sort){
    if (req.query.sort !== 'rating' && req.query.sort !== 'app'){
      return res.status(400).json({error: 'Sort must be set by "rating" or "app"'});
    }

    filteredApps.sort((a, b) => {
      // 1 | -1 to reverse the order || 0 to leave it where it is 
      //use bracket notation to handle dynamic data - we do not know if sort will be by title or by rank
      return a[req.query.sort] < b[req.query.sort]? -1 : 1;
    });
  }

  res.json(filteredApps);
});

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on PORT 8000');
});