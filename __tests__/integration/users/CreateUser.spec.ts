import request from 'supertest';
import { Connection, getRepository, getConnection, Repository } from 'typeorm';

import User from '../../../src/modules/users/infra/typeorm/entities/User';
import createConnection from '../../../src/shared/infra/typeorm/index';

import app from '../../../src/shared/infra/http/app';

let connection: Connection;
let usersRepository: Repository<User>;

describe('Create user', () => {
  beforeAll(async () => {
    connection = await createConnection('test');
    usersRepository = getRepository(User);
  });

  afterEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeTruthy();

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create two users with the same email', async () => {
    await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const response = await request(app).post('/users').send({
      name: 'Breno Almeida Ribeiro',
      email: 'guilhermemartins@armyspy.com',
      password: 'miQuoh5f',
    });

    const user = await usersRepository.find({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toHaveLength(1);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: expect.stringMatching('error'),
        message: expect.stringMatching('Este endereço de e-mail já está em uso. Tente outro.'),
      }),
    );
  });

  it('should not be able to create a new user with no name', async () => {
    const response = await request(app).post('/users').send({
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'nome' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new user without e-mail', async () => {
    const response = await request(app).post('/users').send({
      name: 'Guilherme Martins',
      password: 'jieNgae7',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'e-mail' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new user with an invalid e-mail', async () => {
    const response = await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'ajksdhgaskjdhasd',
      password: 'jieNgae7',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching('Insira um e-mail válido'),
      }),
    );
  });

  it('should not be able to create a new user without a password', async () => {
    const response = await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'senha' não pode estar vazio"),
      }),
    );
  });

  it('should not be able to create a new user with a password of less than 6 digits', async () => {
    const response = await request(app).post('/users').send({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: '12345',
    });

    const user = await usersRepository.findOne({
      where: { email: 'guilhermemartins@armyspy.com' },
    });

    expect(user).toBeFalsy();

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.stringMatching('Bad Request'),
        message: expect.stringMatching("O campo 'senha' tem que ter pelo menos 6 dígitos"),
      }),
    );
  });
});
