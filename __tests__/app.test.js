import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/albums', () => {

    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
      console.log(JSON.stringify(user));
    });

    let nothingToNothing = {
      id: expect.any(Number),
      band: 'Tear It Up',
      album: 'Nothing To Nothing',
      year: 2011,
      genre: 'Hardcore',
      img: '',
      isPlatinum: false
    };

    let germfreeAdolescents = {
      id: expect.any(Number),
      band: 'X-Ray Spex',
      album: 'Germfree Adolescents',
      year: 1978,
      genre: 'Punk Rock',
      img: '',
      isPlatinum: false
    };

    let slip =  {
      id: expect.any(Number),
      band: 'Quicksand',
      album: 'Slip',
      year: 1993,
      genre: 'Post-Hardcore',
      img: '',
      isPlatinum: false
    };

    it('POST nothingToNothing to /api/albums', async () => {
      nothingToNothing.userId = user.id;
      console.log('inside of post: ' + JSON.stringify(nothingToNothing));
      const response = await request
        .post('/api/albums')
        .send(nothingToNothing);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(nothingToNothing);

      nothingToNothing = response.body;
    });

    it('PUT updated slip to /api/albums:id', async () => {
      nothingToNothing.genre = 'Punk Hardcore';
      nothingToNothing.isPlatinum = true;
      console.log(JSON.stringify(nothingToNothing));

      const response = await request
        .put(`/api/albums/${nothingToNothing.id}`)
        .send(nothingToNothing);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(nothingToNothing);
    });

    it('GET list of albums from /api/albums', async () => {
      slip.userId = user.id;
      const r1 = await request.post('/api/albums').send(slip);
      slip = r1.body;

      germfreeAdolescents.userId = user.id;
      const r2 = await request.post('/api/albums').send(germfreeAdolescents);
      germfreeAdolescents = r2.body;
    
      const response = await request.get('/api/albums');

      expect(response.status).toBe(200);

      const expected = [nothingToNothing].map(album => {
        return { 
          userName: user.name,
          ...album
        };
      });
      
      expect(response.body).toEqual(expect.arrayContaining(expected));
    });

    it('GET slip from /api/albums/:id', async () => {
      const response = await request.get(`/api/albums/${slip.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...slip, userName: user.name });
    });

    it('DELETE nothingToNothing from /api/albums/:id', async () => {
      const response = await request.delete(`/api/albums/${nothingToNothing.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(nothingToNothing);

      const getResponse = await request.get('/api/albums');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.find(album => album.id === nothingToNothing.id)).toBeUndefined();
    });

  });

  describe('seed data tests', () => {

    beforeAll(() => {
      execSync('npm run setup-db');
    });

    it('GET /api/albums', async () => {
    // act - make the request
      const response = await request.get('/api/albums');

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return some data?
      expect(response.body.length).toBeGreaterThan(0);
    
      // did the data get inserted?
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        band: expect.any(String),
        album: expect.any(String),
        year: expect.any(Number),
        genre: expect.any(String),
        img: expect.any(String),
        isPlatinum: expect.any(Boolean),
        userId: expect.any(Number),
        userName: expect.any(String)

      });
    });
  });
});



// If a GET request is made to /api/cats, does:
// 1) the server respond with status of 200
// 2) the body match the expected API data?
// it('GET /api/album', async () => {
// // act - make the request
//   const response = await request.get('/api/albums');

//   // was response OK (200)?
//   expect(response.status).toBe(200);

//   // did it return the data we expected?
//   expect(response.body).toEqual(expectedAlbums);

// });

// If a GET request is made to /api/cats/:id, does:
// 1) the server respond with status of 200
// 2) the body match the expected API data for the cat with that id?
// test('GET /api/albums/:id', async () => {
//   const response = await request.get('/api/albums/2');
//   expect(response.status).toBe(200);
//   expect(response.body).toEqual(expectedAlbums[1]);
// });
