import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('testing all routes except for re-seeding get', () => {

    beforeAll(() => {
      execSync('npm run recreate-tables');
    });



 

    // const expectedAlbums = [

    //   {
    //     id: expect.any(Number),
    //     band: 'Quicksand',
    //     album: 'Slip',
    //     year: 1993,
    //     genre: 'Post-Hardcore',
    //     img: '',
    //     isPlatinum: false
    //   },
    //   {
    //     id: expect.any(Number),
    //     band: 'Minor Threat',
    //     album: 'Out of Step',
    //     year: 1983,
    //     genre: 'Punk Hardcore',
    //     img: '',
    //     isPlatinum: false
    //   },
    //   {
    //     id: expect.any(Number),
    //     band: 'X-Ray Spex',
    //     album: 'Gremfree Adolescents',
    //     year: 1978,
    //     genre: 'Punk Rock',
    //     img: '',
    //     isPlatinum: false
    //   },
    //   {
    //     id: expect.any(Number),
    //     band: 'Cocks Sparrer',
    //     album: 'Shock Troops',
    //     year: 1982,
    //     genre: 'Punk Rock',
    //     img: '',
    //     isPlatinum: false
    //   },
    //   {
    //     id: expect.any(Number),
    //     band: 'Hole',
    //     album: 'Celebrity Skin',
    //     year: 1998,
    //     genre: 'Alternative Rock',
    //     img: '',
    //     isPlatinum: true
    //   },
    //   {
    //     id: expect.any(Number),
    //     band: 'Operation Ivy',
    //     album: 'Self-titled',
    //     year: 1991,
    //     genre: 'Punk Rock',
    //     img: '',
    //     isPlatinum: false
    //   }
    // ];

    let tearItUp = {
      id: expect.any(Number),
      band: 'Tear It Up',
      album: 'Nothing To Nothing',
      year: 2011,
      genre: 'Alternative Rock',
      img: '',
      isPlatinum: false
    };

    let xRaySpex = {
      id: expect.any(Number),
      band: 'X-Ray Spex',
      album: 'Gremfree Adolescents',
      year: 1978,
      genre: 'Punk Rock',
      img: '',
      isPlatinum: false
    };

    let quicksand =  {
      id: expect.any(Number),
      band: 'Quicksand',
      album: 'Slip',
      year: 1993,
      genre: 'Post-Hardcore',
      img: '',
      isPlatinum: false
    };

    it('POST tearItUp to /api/albums', async () => {
      const response = await request
        .post('/api/albums')
        .send(tearItUp);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tearItUp);

      tearItUp = response.body;
    });

    it('PUT updated quicksand to /api/albums:id', async () => {
      tearItUp.genre = 'Punk Hardcore';
      tearItUp.isPlatinum = true;

      const response = await request
        .put(`/api/albums/${tearItUp.id}`)
        .send(tearItUp);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(tearItUp);

    });

    it('GET list of albums from /api/albums', async () => {
      const r1 = await request.post('/api/albums').send(quicksand);
      quicksand = r1.body;
      const r2 = await request.post('/api/albums').send(xRaySpex);
      xRaySpex = r2.body;
    
      const response = await request.get('/api/albums');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([tearItUp, quicksand, xRaySpex]));
    });

    it('GET quicksand from /api/albums/:id', async () => {
      const response = await request.get(`/api/albums/${quicksand.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(quicksand);
    });

    it('DELETE tearItUp from /api/albums/:id', async () => {
      const response = await request.delete(`/api/albums/${tearItUp.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(tearItUp);

      const getResponse = await request.get('/api/albums');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toEqual(expect.arrayContaining([quicksand, xRaySpex]));
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
        isPlatinum: expect.any(Boolean)
      });
    });

  });

});