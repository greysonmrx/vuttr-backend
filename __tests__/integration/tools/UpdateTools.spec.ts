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

describe('Update tool', () => {
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

  it('should be able to update a tool', async () => {
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

    const response = await request(app)
      .put(`/tools/${body.id}`)
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

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a tool without a token', async () => {
    const response = await request(app).put(`/tools/toolId`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token not provided.'),
      }),
    );
  });

  it('should not be able to update a tool with a invalid token', async () => {
    const response = await request(app).put(`/tools/toolId`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Invalid token.'),
      }),
    );
  });

  it('should not be able to update a tool with duplicate title', async () => {
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

    await request(app)
      .post('/tools')
      .send({
        title: 'notion',
        link: 'https://notion.so',
        description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
        tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .put(`/tools/${body.id}`)
      .send({
        title: 'notion',
        link: 'https://notion.so',
        description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
        tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
      })
      .set('Authorization', `Bearer ${token}`);

    const tools = await toolsRepository.find({
      where: { title: 'notion' },
    });

    expect(tools).toHaveLength(1);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Tool already created.'),
      }),
    );
  });

  it('should not be able to update a non-existing tool', async () => {
    const response = await request(app)
      .put(`/tools/${v4()}`)
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Tool not found.'),
      }),
    );
  });

  it('should not be able to update a tool with a invalid id', async () => {
    const response = await request(app)
      .put(`/tools/invalid-id`)
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'toolId' must be a valid UUID."),
      }),
    );
  });

  it('should not be able to update a tool without a title', async () => {
    const response = await request(app)
      .put(`/tools/${v4()}`)
      .send({
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'title' field mustn't be empty."),
      }),
    );
  });

  it('should not be able to update a tool without a link', async () => {
    const response = await request(app)
      .put(`/tools/${v4()}`)
      .send({
        title: 'hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'link' field mustn't be empty."),
      }),
    );
  });

  it('should not be able to update a tool without a description', async () => {
    const response = await request(app)
      .put(`/tools/${v4()}`)
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
