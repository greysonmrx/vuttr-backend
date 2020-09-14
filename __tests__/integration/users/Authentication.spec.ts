import request from 'supertest';
import { Connection, getConnection } from 'typeorm';

import createConnection from '../../../src/shared/infra/typeorm/index';

import app from '../../../src/shared/infra/http/app';

let connection: Connection;

describe('Authentication', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to authenticate a user with valid credentials', async () => {
    await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const response = await request(app).post('/sessions').send({
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      }),
    );
  });

  it('should not be able to authenticate a user with the wrong e-mail', async () => {
    await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const response = await request(app).post('/sessions').send({
      email: 'fake@user.com.br',
      password: 'jieNgae7',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Incorrect email/password combination.'),
      }),
    );
  });

  it('should not be able to authenticate a user with the wrong password', async () => {
    await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const response = await request(app).post('/sessions').send({
      email: 'guilhermemartins@armyspy.com',
      password: '012345',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Incorrect email/password combination.'),
      }),
    );
  });

  it('should not be able to authenticate a user without e-mail', async () => {
    const response = await request(app).post('/sessions').send({
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'email' field mustn't be empty."),
      }),
    );
  });

  it('should not be able to authenticate a user with an invalid e-mail', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'ajksdhgaskjdhasd',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'email' field must be a valid email."),
      }),
    );
  });

  it('should not be able to authenticate a user without a password', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'fakeadmin@tenant.com.br',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'password' field mustn't be empty."),
      }),
    );
  });

  it('should not be able to authenticate a user with a password of less than 6 digits', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'fake@user.com',
      password: '12345',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("The 'password' length must be at least 6 characters long."),
      }),
    );
  });
});
