import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';
import { v4 } from 'uuid';

import Tool from '../../../src/modules/tools/infra/typeorm/entities/Tool';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let toolsRepository: Repository<Tool>;

describe('Delete tool', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    toolsRepository = getRepository(Tool);
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

  it('should be able to delete a tool', async () => {
    const { body } = await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app).delete(`/tools/${body.id}`).set('Authorization', `Bearer ${token}`);

    const tool = await toolsRepository.findOne({
      where: { title: 'hotel' },
    });

    expect(tool).toBeFalsy();

    expect(response.status).toBe(204);
  });

  it('should not be able to delete a tool without a token', async () => {
    const response = await request(app).delete(`/tools/${v4()}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token not provided.'),
      }),
    );
  });

  it('should not be able to delete a tool with a invalid token', async () => {
    const response = await request(app).delete(`/tools/${v4()}`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Invalid token.'),
      }),
    );
  });

  it('should not be able to delete a non-existing tool', async () => {
    const response = await request(app).delete(`/tools/${v4()}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Tool not found.'),
      }),
    );
  });

  it('should not be able to delete a tool with a invalid id', async () => {
    const response = await request(app).delete(`/tools/invalid-id`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'toolId' must be a valid UUID."),
      }),
    );
  });
});
