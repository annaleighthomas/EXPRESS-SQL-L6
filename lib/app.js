/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('albums API');
});

app.post('/api/albums', async (req, res) => {
  try {
    const album = req.body;

    const data = await client.query(`
    INSERT INTO albums (band, album, year, genre, img, is_platinum)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, band, album, year, genre, img, is_platinum as "isPlatinum";
  `, [album.band, album.album, album.year, album.genre, album.img, album.isPlatinum]);
    
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

app.put('/api/albums/:id', async (req, res) => {
  try {
    const album = req.body;

    const data = await client.query(`
      UPDATE albums
      SET band = $1, album = $2, year = $3, 
      genre = $4, img = $5, is_platinum = $6
      WHERE id = $7
      RETURNING id, band, album, year, genre, img, is_platinum as "isPlatinum";
    `, [album.band, album.album, album.year, album.genre, album.img, album.isPlatinum, req.params.id]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// API routes,
app.get('/api/albums', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              band,
              album,
              year,
              genre,
              img,
              is_platinum as "isPlatinum"
      FROM    albums;
    `);

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/albums/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              band,
              album,
              year,
              genre,
              img,
              is_platinum as "isPlatinum"
      FROM    albums
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

export default app;