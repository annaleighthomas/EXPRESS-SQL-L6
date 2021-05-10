/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import albums from './album-data.js';


run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, password_hash)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
        [user.name, user.email, user.password]);
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      albums.map(album => {
        return client.query(`
        INSERT INTO albums (band, album, year, genre, img, is_platinum, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [album.band, album.album, album.year, album.genre, album.img, album.isPlatinum, user.id]);
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