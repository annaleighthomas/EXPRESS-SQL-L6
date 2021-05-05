/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import albums from './album-data.js';

run();

async function run() {

  try {

    await Promise.all(
      albums.map(album => {
        return client.query(`
        INSERT INTO albums (band, album, year, genre, img, is_platinum)
        VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [album.band, album.album, album.year, album.genre, album.img, album.isPlatinum]);
      })
    );


    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}