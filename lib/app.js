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

app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email; 
    `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

app.post('/api/albums', async (req, res) => {
  try {
    const album = req.body;

    const data = await client.query(`
    INSERT INTO albums (band, album, year, genre, img, is_platinum, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, band, album, year, genre, img, is_platinum as "isPlatinum", user_id as "userId";
  `, [album.band, album.album, album.year, album.genre, album.img, album.isPlatinum, album.userId]);
    
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
      RETURNING id, band, album, year, genre, img, is_platinum as "isPlatinum", user_id as "userId";
    `, [album.band, album.album, album.year, album.genre, album.img, album.isPlatinum, req.params.id]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/albums/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM  albums 
      WHERE id = $1
      RETURNING 
      id, 
      band, 
      album, 
      year, 
      genre, 
      img, 
      is_platinum as "isPlatinum",
      user_id as "userId";
    `, [req.params.id]);

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
      SELECT  a.id,
              band,
              album,
              year,
              genre,
              img,
              is_platinum as "isPlatinum",
              user_id as "userId",
              u.name as "userName"
      FROM    albums a
      JOIN    users u
      ON      a.user_id = u.id;
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
      SELECT  a.id,
              band,
              album,
              year,
              genre,
              img,
              is_platinum as "isPlatinum",
              user_id as "userId",
              u.name as "userName"
      FROM    albums a
      JOIN    users u
      ON      a.user_id = u.id
      WHERE   a.id = $1;
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