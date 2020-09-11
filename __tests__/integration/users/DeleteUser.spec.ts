import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';

import User from '../../../src/modules/users/infra/typeorm/entities/User';
import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let usersRepository: Repository<User>;

describe('Delete user', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    usersRepository = getRepository(User);
  });

  beforeEach(async () => {
    token = await getUserTokenJWT();
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to delete a user', async () => {
    const response = await request(app).delete(`/users`).set('Authorization', `Bearer ${token}`);

    const deletedUser = await usersRepository.findOne({
      where: { email: 'greysonmrx@gmail.com' },
    });

    expect(deletedUser).toBeFalsy();

    expect(response.status).toBe(204);
  });

  it('should not be able to delete a user without a token', async () => {
    const response = await request(app).delete(`/users`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to delete a user with a invalid token', async () => {
    const response = await request(app).delete(`/users`).set('Authorization', `Bearer invalid.token`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });
});
