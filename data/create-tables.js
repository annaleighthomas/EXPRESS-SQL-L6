/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(`          
      CREATE TABLE albums (
        id SERIAL PRIMARY KEY NOT NULL,
        band VARCHAR(512) NOT NULL,
        album VARCHAR(512) NOT NULL,
        year INTEGER NOT NULL,
        genre VARCHAR(512) NOT NULL,
        img VARCHAR(1012),
        is_platinum BOOLEAN DEFAULT FALSE NOT NULL
      );
    `);

    console.log('create tables complete');
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}