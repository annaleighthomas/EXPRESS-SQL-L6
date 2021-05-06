import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run recreate-tables');
  });

  afterAll(async () => {
    return client.end();
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

  let xRaySPex = {
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

  


  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it.skip('GET /api/album', async () => {
    // act - make the request
    const response = await request.get('/api/albums');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedAlbums);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test.skip('GET /api/albums/:id', async () => {
    const response = await request.get('/api/albums/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedAlbums[1]);
  });

});