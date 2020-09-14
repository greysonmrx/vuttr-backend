import request from 'supertest';
import { Connection, getConnection } from 'typeorm';

import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;

describe('List tools', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  beforeEach(async () => {
    token = await getUserTokenJWT();
  });

  afterEach(async () => {
    await connection.query('DELETE FROM tools');
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to list all tools', async () => {
    await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/tools')
      .send({
        title: 'notion',
        link: 'https://notion.so',
        description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
        tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app).get('/tools').set('Authorization', `Bearer ${token}`);

    expect(response.body.tools).toHaveLength(2);
    expect(response.status).toBe(200);
  });

  it('should be able filter tools by tag', async () => {
    await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/tools')
      .send({
        title: 'notion',
        link: 'https://notion.so',
        description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
        tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app).get('/tools?tag=calendar').set('Authorization', `Bearer ${token}`);

    expect(response.body.tools).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  it('should not be able to list all tools without a token', async () => {
    const response = await request(app).get(`/tools`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token not provided.'),
      }),
    );
  });

  it('should not be able to list all tools with a invalid token', async () => {
    const response = await request(app).get(`/tools`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Invalid token.'),
      }),
    );
  });

  it('should not be able to list all tools with a invalid page number', async () => {
    const response = await request(app).get('/tools?page=page').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'page' param must be a number."),
      }),
    );
  });
});
