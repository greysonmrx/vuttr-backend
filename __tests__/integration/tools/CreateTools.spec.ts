import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';

import Tool from '../../../src/modules/tools/infra/typeorm/entities/Tool';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let toolsRepository: Repository<Tool>;

describe('Create tool', () => {
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

  it('should be able to create a new tool', async () => {
    const response = await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    const tool = await toolsRepository.findOne({
      where: { title: 'hotel' },
    });

    expect(tool).toBeTruthy();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new tool without a token', async () => {
    const response = await request(app).post(`/tools`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token not provided.'),
      }),
    );
  });

  it('should not be able to create a new tool with a invalid token', async () => {
    const response = await request(app).post(`/tools`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Invalid token.'),
      }),
    );
  });

  it('should not be able to create two tools with the same title', async () => {
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

    const response = await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    const tool = await toolsRepository.find({
      where: { title: 'hotel' },
    });

    expect(tool).toHaveLength(1);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Tool already created.'),
      }),
    );
  });

  it('should not be able to create a new tool without a title', async () => {
    const response = await request(app)
      .post('/tools')
      .send({
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    const tool = await toolsRepository.findOne({
      where: { title: 'hotel' },
    });

    expect(tool).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'title' field mustn't be empty."),
      }),
    );
  });

  it('should not be able to create a new tool without a link', async () => {
    const response = await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    const tool = await toolsRepository.findOne({
      where: { title: 'hotel' },
    });

    expect(tool).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'link' field mustn't be empty."),
      }),
    );
  });

  it('should not be able to create a new tool without a description', async () => {
    const response = await request(app)
      .post('/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    const tool = await toolsRepository.findOne({
      where: { title: 'hotel' },
    });

    expect(tool).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'description' field mustn't be empty."),
      }),
    );
  });
});
