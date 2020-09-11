import request from 'supertest';
import { Connection, getConnection, getRepository, Repository } from 'typeorm';

import createConnection from '../../../src/shared/infra/typeorm/index';
import getUserTokenJWT from '../../utils/getUserTokenJWT';
import User from '../../../src/modules/users/infra/typeorm/entities/User';

import app from '../../../src/shared/infra/http/app';

let token: string;
let connection: Connection;
let usersRepository: Repository<User>;

describe('Update user', () => {
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

  it('should be able to update a user', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to update a user without a token', async () => {
    const response = await request(app).put('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com.br',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com.br' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token não informado.'),
      }),
    );
  });

  it('should not be able to update a user with a invalid token', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com.br',
      })
      .set('Authorization', `Bearer invalid.token`);

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com.br' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Token inválido.'),
      }),
    );
  });

  it('should not be able to update a non-existent user', async () => {
    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    if (user) {
      await usersRepository.delete(user.id);
    }

    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Usuário não encontrado.'),
      }),
    );
  });

  it('should not be able to update a user with no name', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        email: 'guilhermemartins@armyspy.com',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update a user without a e-mail', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'e-mail' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to update user with duplicate email', async () => {
    await usersRepository.save(
      usersRepository.create({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com.br',
        password: 'jieNgae7',
      }),
    );

    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com.br',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Este endereço de e-mail já está em uso. Tente outro.'),
      }),
    );
  });

  it('should not be able to update a user with a invalid e-mail', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'askjdgasfsfdgedfghklj',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um e-mail válido'),
      }),
    );
  });

  it('should not be able to update a user without the current password when a new password exists', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        password: 'miQuoh5f',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Você precisa informar a senha atual para criar uma nova.'),
      }),
    );
  });

  it('should not be able to update user with an incorrect password', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        current_password: 'miQuoh5f',
        password: 'jieNgae7',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Senha incorreta.'),
      }),
    );
  });

  it('should not be able to update user with a new password of less than 6 digits', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        current_password: 'jieNgae7',
        password: '12345',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'senha' tem que ter pelo menos 6 dígitos"),
      }),
    );
  });

  it('should not be able to update user with a current password of less than 6 digits', async () => {
    const response = await request(app)
      .put('/users')
      .send({
        name: 'Guilherme Martins',
        email: 'guilhermemartins@armyspy.com',
        current_password: '12345',
        password: 'miQuoh5f',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'senha atual' tem que ter pelo menos 6 dígitos"),
      }),
    );
  });
});
